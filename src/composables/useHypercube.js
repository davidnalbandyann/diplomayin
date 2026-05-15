import { ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { N_MIN, N_MAX } from '../config.js'
import { generateVertices, generateEdges, groupByK, runCount, colorForK, generateGrayCode, reduceRuns } from '../utils/cubeMath.js'
import { forceDirectedLayout, directLayout, shellLayout } from '../utils/layout.js'

const SCENE_THEMES = {
  light: {
    background: 0xedf7ff,
    exposure: 0.96,
    ambientColor: 0xffffff,
    ambientIntensity: 0.78,
    dirColor: 0xffffff,
    dirIntensity: 0.86,
    dimColor: 0xb7ead7,
    dimIntensity: 0.28,
    vertexEmissive: 0.12,
    inactiveVertex: 0xd7e5f4,
    defaultEdge: 0x9aabc0,
    activeEdge: 0x64748b,
    inactiveEdge: 0xd6e1ed,
    edgeOpacity: 0.48,
    inactiveEdgeOpacity: 0.035,
    pathColor: 0xf59e0b,
    pathAnimatorColor: 0xf97316,
    pathOpacity: 0.66,
    labelColor: '#334155',
    labelBackground: 'rgba(255, 255, 255, 0.92)',
    labelBorder: '1px solid rgba(100, 116, 139, 0.18)',
    labelShadow: '0 4px 12px rgba(71, 85, 105, 0.12)',
  },
  dark: {
    background: 0x0f172a,
    exposure: 1.0,
    ambientColor: 0x334466,
    ambientIntensity: 0.6,
    dirColor: 0xffffff,
    dirIntensity: 0.9,
    dimColor: 0x6688cc,
    dimIntensity: 0.3,
    vertexEmissive: 0.0,
    inactiveVertex: 0x334155,
    defaultEdge: 0x64748b,
    activeEdge: 0x94a3b8,
    inactiveEdge: 0x1e293b,
    edgeOpacity: 0.35,
    inactiveEdgeOpacity: 0.005,
    pathColor: 0xfbbf24,
    pathAnimatorColor: 0xfbbf24,
    pathOpacity: 0.6,
    labelColor: '#94a3b8',
    labelBackground: 'rgba(15, 23, 42, 0.7)',
    labelBorder: 'none',
    labelShadow: 'none',
  },
}

export function useHypercube(canvasRef) {
  const n = ref(1)
  const selectedK = ref(null)
  const selectedBinaryString = ref(null)
  const groups = shallowRef(new Map())
  const isTransitioning = ref(false)
  const layoutMode = ref('standard')
  const showPath = ref(false)
  const hoveredVertex = ref(null)
  const sceneTheme = ref('light')

  let scene, camera, renderer, composer, controls, labelRenderer
  let ambientLight, dirLight, dimLight
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
  let pathMesh = null
  let pathAnimator = null
  let targetCamPos = null
  let targetCamLook = null

  function activeSceneTheme() {
    return SCENE_THEMES[sceneTheme.value] || SCENE_THEMES.light
  }

  function applyLabelTheme(label) {
    const colors = activeSceneTheme()
    label.element.style.color = colors.labelColor
    label.element.style.background = colors.labelBackground
    label.element.style.border = colors.labelBorder
    label.element.style.boxShadow = colors.labelShadow
  }

  function applySceneTheme() {
    const colors = activeSceneTheme()
    if (!scene) return

    scene.background = new THREE.Color(colors.background)
    if (renderer) renderer.toneMappingExposure = colors.exposure
    if (ambientLight) {
      ambientLight.color.setHex(colors.ambientColor)
      ambientLight.intensity = colors.ambientIntensity
    }
    if (dirLight) {
      dirLight.color.setHex(colors.dirColor)
      dirLight.intensity = colors.dirIntensity
    }
    if (dimLight) {
      dimLight.color.setHex(colors.dimColor)
      dimLight.intensity = colors.dimIntensity
    }
    if (pathMesh) {
      pathMesh.material.color.setHex(colors.pathColor)
      pathMesh.material.opacity = colors.pathOpacity
    }
    if (pathAnimator) {
      pathAnimator.material.color.setHex(colors.pathAnimatorColor)
    }
    for (const label of labelElements) {
      applyLabelTheme(label)
    }
    if (selectedK.value === null) clearHighlight()
    else updateHighlight(selectedK.value)
  }

  function initScene() {
    const canvas = canvasRef.value
    if (!canvas) return
    const colors = activeSceneTheme()

    const w = canvas.clientWidth
    const h = canvas.clientHeight

    scene = new THREE.Scene()
    scene.background = new THREE.Color(colors.background)

    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(4, 3, 6)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ReinhardToneMapping
    renderer.toneMappingExposure = colors.exposure
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

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.05, 0.2, 0.1)
    composer.addPass(bloomPass)

    ambientLight = new THREE.AmbientLight(colors.ambientColor, colors.ambientIntensity)
    scene.add(ambientLight)

    dirLight = new THREE.DirectionalLight(colors.dirColor, colors.dirIntensity)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    dimLight = new THREE.DirectionalLight(colors.dimColor, colors.dimIntensity)
    dimLight.position.set(-5, -3, -5)
    scene.add(dimLight)

    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
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

  function getIntersectedVertex(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const meshes = vertexMeshes.map(vm => vm.mesh)
    const intersects = raycaster.intersectObjects(meshes)
    if (intersects.length > 0) {
      const hitIdx = meshes.indexOf(intersects[0].object)
      if (hitIdx !== -1) return vertexMeshes[hitIdx]
    }
    return null
  }

  function onPointerDown(event) {
    const vm = getIntersectedVertex(event)
    if (vm) {
      const v = vertices[vm.vIdx]
      if (selectedK.value === vm.k && selectedBinaryString.value === v.label) {
        selectedK.value = null
        selectedBinaryString.value = null
        clearHighlight()
      } else {
        selectedK.value = vm.k
        selectedBinaryString.value = v.label
        updateHighlight(vm.k)
      }
    }
  }

  function onPointerMove(event) {
    const vm = getIntersectedVertex(event)
    if (vm) {
      const v = vertices[vm.vIdx]
      hoveredVertex.value = { label: v.label, bits: v.bits, k: vm.k, id: v.id }
    } else {
      hoveredVertex.value = null
    }
    document.body.style.cursor = vm ? 'pointer' : ''
  }

  function updateHighlight(k) {
    const colors = activeSceneTheme()
    for (const vm of vertexMeshes) {
      const on = vm.k === k
      vm.targetScale = on ? 1.8 : 0.4
      vm.targetOpacity = on ? 1.0 : 0.08
      vm.mesh.material.emissiveIntensity = on ? 0.8 : 0.0
      if (!on) {
        vm.mesh.material.color.setHex(colors.inactiveVertex)
      } else {
        vm.mesh.material.color.copy(vm.origColor)
      }
    }
    for (const em of edgeMeshes) {
      const on = em.k1 === k || em.k2 === k
      em.targetOpacity = on ? 0.95 : colors.inactiveEdgeOpacity
      if (!on) {
        em.mesh.material.color.setHex(colors.inactiveEdge)
      } else {
        em.mesh.material.color.setHex(colors.activeEdge)
      }
    }
    for (const l of labelElements) {
      l.element.style.opacity = l.__k === k ? '1' : '0.15'
    }
  }

  function clearHighlight() {
    const colors = activeSceneTheme()
    for (const vm of vertexMeshes) {
      vm.targetScale = 1.0
      vm.targetOpacity = 1.0
      vm.mesh.material.emissiveIntensity = colors.vertexEmissive
      vm.mesh.material.color.copy(vm.origColor)
    }
    for (const em of edgeMeshes) {
      em.targetOpacity = colors.edgeOpacity
      em.mesh.material.color.setHex(colors.defaultEdge)
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

  function buildPathOverlay() {
    if (pathMesh) {
      scene.remove(pathMesh)
      pathMesh.geometry.dispose()
      pathMesh.material.dispose()
      pathMesh = null
    }
    if (pathAnimator) {
      scene.remove(pathAnimator)
      pathAnimator.geometry.dispose()
      pathAnimator.material.dispose()
      pathAnimator = null
    }
    if (!showPath.value) return

    const ids = generateGrayCode(n.value)
    const pos = getCurrentPositions()
    const points = ids.map(id => new THREE.Vector3(pos[id * 3], pos[id * 3 + 1], pos[id * 3 + 2]))
    const colors = activeSceneTheme()

    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeom = new THREE.TubeGeometry(curve, points.length * 4, 0.015, 4, false)
    const tubeMat = new THREE.MeshBasicMaterial({ color: colors.pathColor, transparent: true, opacity: colors.pathOpacity })
    pathMesh = new THREE.Mesh(tubeGeom, tubeMat)
    scene.add(pathMesh)

    const animGeom = new THREE.SphereGeometry(0.08, 12, 12)
    const animMat = new THREE.MeshBasicMaterial({ color: colors.pathAnimatorColor })
    pathAnimator = new THREE.Mesh(animGeom, animMat)
    scene.add(pathAnimator)
  }

  function getCurrentPositions() {
    if (layoutState && layoutState.positions) {
      return layoutState.positions
    }
    const pos = new Float32Array(vertices.length * 3)
    for (let i = 0; i < vertexMeshes.length; i++) {
      const p = vertexMeshes[i].mesh.position
      pos[i * 3] = p.x
      pos[i * 3 + 1] = p.y
      pos[i * 3 + 2] = p.z
    }
    return pos
  }

  function buildScene() {
    const currentN = n.value
    vertices = generateVertices(currentN)
    edges = generateEdges(vertices, currentN)
    const groupsMap = groupByK(vertices, currentN)
    groups.value = groupsMap

    if (layoutMode.value === 'shell') {
      const pos = shellLayout(vertices, currentN)
      layoutState = { positions: pos, tick: () => 0 }
    } else {
      const vertexPositions = currentN <= 3 ? directLayout(vertices, currentN) : null
      layoutState = forceDirectedLayout(vertices, edges, currentN, vertexPositions)
      if (currentN > 3) {
        for (let iter = 0; iter < 200; iter++) {
          layoutState.tick()
        }
      }
    }

    const pos = layoutState.positions
    const colors = activeSceneTheme()

    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i]
      const k = runCount(v.bits)
      const hexColor = colorForK(k, currentN)
      const color = new THREE.Color(hexColor)

      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: colors.vertexEmissive,
        metalness: 0.0,
        roughness: 0.46,
        transparent: true,
        opacity: 0,
      })
      const geom = new THREE.SphereGeometry(0.23, 20, 20)
      const mesh = new THREE.Mesh(geom, mat)
      mesh.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
      scene.add(mesh)

      vertexMeshes.push({ mesh, k, targetScale: 1.0, targetOpacity: 1.0, vIdx: i, origColor: color.clone() })

      const div = document.createElement('div')
      div.textContent = v.label
      div.style.fontFamily = '"JetBrains Mono", monospace'
      div.style.fontSize = '10px'
      div.style.fontWeight = '500'
      div.style.padding = '1px 5px'
      div.style.borderRadius = '3px'
      div.style.pointerEvents = 'none'
      div.style.userSelect = 'none'
      div.style.transition = 'opacity 0.2s'
      const label = new CSS2DObject(div)
      applyLabelTheme(label)
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

      const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2)
      const tubeGeom = new THREE.TubeGeometry(curve, 8, 0.02, 6, false)
      const tubeMat = new THREE.MeshBasicMaterial({
        color: colors.defaultEdge,
        transparent: true,
        opacity: 0,
      })
      const tube = new THREE.Mesh(tubeGeom, tubeMat)
      scene.add(tube)

      edgeMeshes.push({ mesh: tube, k1: runCount(vertices[a].bits), k2: runCount(vertices[b].bits), aIdx: a, bIdx: b, targetOpacity: colors.edgeOpacity })
    }

    buildPathOverlay()
    updateCameraForN(currentN)
  }

  function updateCameraForN(currentN) {
    const dist = 3 + currentN * 0.8
    targetCamPos = new THREE.Vector3(dist * 0.6, dist * 0.4, dist)
    targetCamLook = new THREE.Vector3(0, 0, 0)
  }

  let pathAnimTime = 0

  function tick() {
    if (!composer) return
    tickCount++

    if (layoutState && n.value > 3 && layoutMode.value === 'standard') {
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
        if (showPath.value) buildPathOverlay()
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

    if (targetCamPos && targetCamLook) {
      camera.position.lerp(targetCamPos, 0.02)
    }

    if (showPath.value && pathAnimator) {
      pathAnimTime += 0.005
      const ids = generateGrayCode(n.value)
      const pos = getCurrentPositions()
      const points = ids.map(id => new THREE.Vector3(pos[id * 3], pos[id * 3 + 1], pos[id * 3 + 2]))
      const curve = new THREE.CatmullRomCurve3(points)
      const t = (Math.sin(pathAnimTime * Math.PI * 2) + 1) / 2
      const p = curve.getPoint(t)
      pathAnimator.position.copy(p)
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
        const colors = activeSceneTheme()
        for (const vm of vertexMeshes) vm.mesh.material.opacity = o
        for (const em of edgeMeshes) em.mesh.material.opacity = o * colors.edgeOpacity
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
      const colors = activeSceneTheme()
      for (const em of edgeMeshes) {
        em.mesh.material.opacity = t * colors.edgeOpacity
        em.targetOpacity = t * colors.edgeOpacity
      }
      for (const l of labelElements) l.element.style.opacity = String(t)
      if (t < 1) requestAnimationFrame(step)
      else isTransitioning.value = false
    }
    requestAnimationFrame(step)
  }

  function clearScene() {
    if (pathMesh) {
      scene.remove(pathMesh)
      pathMesh.geometry.dispose()
      pathMesh.material.dispose()
      pathMesh = null
    }
    if (pathAnimator) {
      scene.remove(pathAnimator)
      pathAnimator.geometry.dispose()
      pathAnimator.material.dispose()
      pathAnimator = null
    }
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
    selectedBinaryString.value = null
    hoveredVertex.value = null
    buildScene()
    fadeIn()
  }

  watch(n, () => { rebuildScene() })

  watch(layoutMode, () => { rebuildScene() })

  watch(showPath, () => {
    if (vertexMeshes.length > 0) {
      buildPathOverlay()
    }
  })

  watch(selectedK, (val) => {
    if (val === null) clearHighlight()
    else updateHighlight(val)
  })

  watch(selectedBinaryString, (val) => {
    if (val === null) {
      selectedK.value = null
    }
  })

  function setTheme(mode) {
    sceneTheme.value = mode === 'dark' ? 'dark' : 'light'
    applySceneTheme()
  }
  function setN(val) { n.value = Math.max(N_MIN, Math.min(N_MAX, val)) }
  function setSelectedK(val) { selectedK.value = val }
  function setSelectedBinaryString(val) {
    selectedBinaryString.value = val
    if (val !== null) {
      const bits = val.split('').map(Number)
      selectedK.value = runCount(bits)
    } else {
      selectedK.value = null
    }
  }
  function clearSelection() {
    selectedK.value = null
    selectedBinaryString.value = null
  }
  function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value
    controls.autoRotate = autoRotate.value
  }
  function setLayoutMode(mode) { layoutMode.value = mode }
  function togglePath() { showPath.value = !showPath.value }

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
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  })

  return { n, selectedK, selectedBinaryString, groups, isTransitioning, layoutMode, showPath, hoveredVertex, sceneTheme, setTheme, setN, setSelectedK, setSelectedBinaryString, clearSelection, toggleAutoRotate, setLayoutMode, togglePath, autoRotate, vertices }
}
