import { ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { generateVertices, generateEdges, groupByK, runCount, colorForK } from '../utils/cubeMath.js'
import { forceDirectedLayout, directLayout } from '../utils/layout.js'

export function useHypercube(canvasRef) {
  const n = ref(1)
  const selectedK = ref(null)
  const groups = shallowRef(new Map())
  const isTransitioning = ref(false)

  let scene, camera, renderer, composer, controls, labelRenderer
  let vertices = []
  let edges = []
  let vertexMeshes = []
  let edgeMeshes = []
  let labelElements = []
  let layoutState = null
  let raycaster, pointer
  let animFrameId = null
  const autoRotate = ref(true)
  let tickCount = 0

  function initScene() {
    const canvas = canvasRef.value
    if (!canvas) return

    const w = canvas.clientWidth
    const h = canvas.clientHeight

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(4, 3, 6)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = 1.0
    canvas.appendChild(renderer.domElement)

    labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(w, h)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    labelRenderer.domElement.style.left = '0'
    labelRenderer.domElement.style.pointerEvents = 'none'
    canvas.appendChild(labelRenderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.2
    controls.minDistance = 2
    controls.maxDistance = 20

    composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.15, 0.3, 0.05)
    composer.addPass(bloomPass)

    const ambientLight = new THREE.AmbientLight(0x334466, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const dimLight = new THREE.DirectionalLight(0x6688cc, 0.3)
    dimLight.position.set(-5, -3, -5)
    scene.add(dimLight)

    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', onResize)
  }

  function onResize() {
    const canvas = canvasRef.value
    if (!canvas || !renderer) return
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    composer.setSize(w, h)
    labelRenderer.setSize(w, h)
  }

  function onPointerDown(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const meshes = vertexMeshes.map(vm => vm.mesh)
    const intersects = raycaster.intersectObjects(meshes)

    if (intersects.length > 0) {
      const hitIdx = meshes.indexOf(intersects[0].object)
      if (hitIdx !== -1) {
        const vm = vertexMeshes[hitIdx]
        selectedK.value = vm.k === selectedK.value ? null : vm.k
        if (selectedK.value !== null) {
          updateHighlight(selectedK.value)
        }
      }
    }
  }

  function updateHighlight(k) {
    for (const vm of vertexMeshes) {
      const on = vm.k === k
      vm.targetScale = on ? 1.6 : 0.8
      vm.targetOpacity = on ? 1.0 : 0.2
      vm.mesh.material.emissiveIntensity = on ? 0.6 : 0.0
    }
    for (const em of edgeMeshes) {
      em.targetOpacity = em.k1 === k || em.k2 === k ? 0.8 : 0.06
    }
    for (const l of labelElements) {
      l.element.style.opacity = l.__k === k ? '1' : '0.3'
    }
  }

  function clearHighlight() {
    for (const vm of vertexMeshes) {
      vm.targetScale = 1.0
      vm.targetOpacity = 1.0
      vm.mesh.material.emissiveIntensity = 0.0
    }
    for (const em of edgeMeshes) {
      em.targetOpacity = 0.35
    }
    for (const l of labelElements) {
      l.element.style.opacity = '1'
    }
  }

  function rebuildEdgeTube(aIdx, bIdx, mesh) {
    const pos = layoutState.positions
    const p1 = new THREE.Vector3(pos[aIdx * 3], pos[aIdx * 3 + 1], pos[aIdx * 3 + 2])
    const p2 = new THREE.Vector3(pos[bIdx * 3], pos[bIdx * 3 + 1], pos[bIdx * 3 + 2])
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
    const dir = new THREE.Vector3().subVectors(p2, p1)
    const len = dir.length()
    if (len < 0.001) return
    dir.normalize()

    const up = new THREE.Vector3(0, 1, 0)
    if (Math.abs(dir.dot(up)) > 0.99) up.set(1, 0, 0)
    const right = new THREE.Vector3().crossVectors(dir, up).normalize()
    const trueUp = new THREE.Vector3().crossVectors(right, dir).normalize()

    const bend = len * 0.12
    const cp1 = new THREE.Vector3().copy(mid).add(right.clone().multiplyScalar(bend))
    cp1.add(trueUp.clone().multiplyScalar(bend * (Math.random() - 0.5)))
    const cp2 = new THREE.Vector3().copy(mid).add(right.clone().multiplyScalar(-bend))
    cp2.add(trueUp.clone().multiplyScalar(bend * (Math.random() - 0.5)))

    const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2)
    const newGeom = new THREE.TubeGeometry(curve, 8, 0.025, 6, false)
    mesh.geometry.dispose()
    mesh.geometry = newGeom
  }

  function buildScene() {
    const currentN = n.value
    vertices = generateVertices(currentN)
    edges = generateEdges(vertices, currentN)
    const groupsMap = groupByK(vertices, currentN)
    groups.value = groupsMap

    const vertexPositions = currentN <= 3 ? directLayout(vertices, currentN) : null
    layoutState = forceDirectedLayout(vertices, edges, currentN, vertexPositions)

    if (currentN > 3) {
      for (let iter = 0; iter < 200; iter++) {
        layoutState.tick()
      }
    }

    const pos = layoutState.positions

    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i]
      const k = runCount(v.bits)
      const hexColor = colorForK(k, currentN)
      const color = new THREE.Color(hexColor)

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.0,
        metalness: 0.15,
        roughness: 0.5,
        transparent: true,
        opacity: 0,
      })
      const geom = new THREE.SphereGeometry(0.2, 20, 20)
      const mesh = new THREE.Mesh(geom, mat)
      mesh.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
      scene.add(mesh)

      vertexMeshes.push({ mesh, k, targetScale: 1.0, targetOpacity: 1.0, vIdx: i })

      const div = document.createElement('div')
      div.textContent = v.label
      div.style.color = '#94a3b8'
      div.style.fontFamily = '"JetBrains Mono", monospace'
      div.style.fontSize = '10px'
      div.style.fontWeight = '500'
      div.style.background = 'rgba(15, 23, 42, 0.7)'
      div.style.padding = '1px 5px'
      div.style.borderRadius = '3px'
      div.style.pointerEvents = 'none'
      div.style.userSelect = 'none'
      div.style.transition = 'opacity 0.2s'
      const label = new CSS2DObject(div)
      label.position.set(pos[i * 3], pos[i * 3 + 1] + 0.35, pos[i * 3 + 2])
      label.__k = k
      scene.add(label)
      labelElements.push(label)
    }

    for (const [a, b] of edges) {
      const p1 = new THREE.Vector3(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2])
      const p2 = new THREE.Vector3(pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2])
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      const dir = new THREE.Vector3().subVectors(p2, p1)
      const len = dir.length()
      dir.normalize()

      const up = new THREE.Vector3(0, 1, 0)
      if (Math.abs(dir.dot(up)) > 0.99) up.set(1, 0, 0)
      const right = new THREE.Vector3().crossVectors(dir, up).normalize()
      const trueUp = new THREE.Vector3().crossVectors(right, dir).normalize()

      const bend = len * 0.12
      const cp1 = new THREE.Vector3().copy(mid).add(right.clone().multiplyScalar(bend))
      cp1.add(trueUp.clone().multiplyScalar(bend * (Math.random() - 0.5)))
      const cp2 = new THREE.Vector3().copy(mid).add(right.clone().multiplyScalar(-bend))
      cp2.add(trueUp.clone().multiplyScalar(bend * (Math.random() - 0.5)))

      const curve = new THREE.CubicBezierCurve3(p1, cp1, p2, cp2)
      const tubeGeom = new THREE.TubeGeometry(curve, 8, 0.02, 6, false)
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x64748b,
        transparent: true,
        opacity: 0,
      })
      const tube = new THREE.Mesh(tubeGeom, tubeMat)
      scene.add(tube)

      edgeMeshes.push({ mesh: tube, k1: runCount(vertices[a].bits), k2: runCount(vertices[b].bits), aIdx: a, bIdx: b, targetOpacity: 0.35 })
    }
  }

  function tick() {
    if (!composer) return

    tickCount++

    if (layoutState && n.value > 3) {
      layoutState.tick()
      const pos = layoutState.positions
      for (let i = 0; i < vertexMeshes.length; i++) {
        const vm = vertexMeshes[i]
        const cur = vm.mesh.position
        const tx = pos[i * 3], ty = pos[i * 3 + 1], tz = pos[i * 3 + 2]
        cur.x += (tx - cur.x) * 0.15
        cur.y += (ty - cur.y) * 0.15
        cur.z += (tz - cur.z) * 0.15
      }

      if (tickCount % 3 === 0) {
        for (const em of edgeMeshes) {
          rebuildEdgeTube(em.aIdx, em.bIdx, em.mesh)
        }
      }
    }

    for (let i = 0; i < vertexMeshes.length; i++) {
      const vm = vertexMeshes[i]
      const s = vm.mesh.scale.x + (vm.targetScale - vm.mesh.scale.x) * 0.1
      vm.mesh.scale.set(s, s, s)
      vm.mesh.material.opacity += (vm.targetOpacity - vm.mesh.material.opacity) * 0.08

      const label = labelElements[i]
      label.position.copy(vm.mesh.position)
      label.position.y += 0.35
    }

    for (const em of edgeMeshes) {
      em.mesh.material.opacity += (em.targetOpacity - em.mesh.material.opacity) * 0.08
    }

    controls.update()
    composer.render()
    labelRenderer.render(scene, camera)
    animFrameId = requestAnimationFrame(tick)
  }

  function fadeOut() {
    return new Promise(resolve => {
      for (const vm of vertexMeshes) vm.targetOpacity = 0
      for (const em of edgeMeshes) em.targetOpacity = 0
      for (const l of labelElements) l.element.style.opacity = '0'
      const start = performance.now()
      const dur = 300
      function step(time) {
        const t = Math.min((time - start) / dur, 1)
        const o = 1 - t
        for (const vm of vertexMeshes) vm.mesh.material.opacity = o
        for (const em of edgeMeshes) em.mesh.material.opacity = o * 0.35
        if (t < 1) requestAnimationFrame(step)
        else resolve()
      }
      requestAnimationFrame(step)
    })
  }

  function fadeIn() {
    const start = performance.now()
    const dur = 400
    function step(time) {
      const t = Math.min((time - start) / dur, 1)
      for (const vm of vertexMeshes) {
        vm.mesh.material.opacity = t
        vm.targetOpacity = t
      }
      for (const em of edgeMeshes) {
        em.mesh.material.opacity = t * 0.35
        em.targetOpacity = t * 0.35
      }
      for (const l of labelElements) l.element.style.opacity = String(t)
      if (t < 1) requestAnimationFrame(step)
      else isTransitioning.value = false
    }
    requestAnimationFrame(step)
  }

  function clearScene() {
    for (const vm of vertexMeshes) {
      scene.remove(vm.mesh)
      vm.mesh.geometry.dispose()
      vm.mesh.material.dispose()
    }
    for (const em of edgeMeshes) {
      scene.remove(em.mesh)
      em.mesh.geometry.dispose()
      em.mesh.material.dispose()
    }
    for (const l of labelElements) {
      scene.remove(l)
      l.element.remove()
    }
    vertexMeshes = []
    edgeMeshes = []
    labelElements = []
    vertices = []
    edges = []
    layoutState = null
  }

  async function rebuildScene() {
    isTransitioning.value = true
    if (vertexMeshes.length > 0) {
      await fadeOut()
      clearScene()
    }
    selectedK.value = null
    buildScene()
    fadeIn()
  }

  watch(n, () => { rebuildScene() })

  watch(selectedK, (val) => {
    if (val === null) clearHighlight()
    else updateHighlight(val)
  })

  function setN(val) { n.value = Math.max(1, Math.min(6, val)) }
  function setSelectedK(val) { selectedK.value = val }
  function clearSelection() { selectedK.value = null }
  function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value
    controls.autoRotate = autoRotate.value
  }

  onMounted(() => {
    initScene()
    buildScene()
    fadeIn()
    tick()
  })

  onBeforeUnmount(() => {
    if (animFrameId) cancelAnimationFrame(animFrameId)
    if (renderer) {
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  })

  return { n, selectedK, groups, isTransitioning, setN, setSelectedK, clearSelection, toggleAutoRotate, autoRotate }
}
