<script setup>
import { ref, provide, inject, watch, onMounted } from 'vue'
import { useHypercube } from '../composables/useHypercube.js'
import HypercubeScene from './HypercubeScene.vue'
import InfoPanel from './InfoPanel.vue'
import VertexHUD from './VertexHUD.vue'

const appState = inject('appState')
const canvasContainer = ref(null)
const hc = useHypercube(canvasContainer)
provide('hypercube', hc)

onMounted(() => {
  hc.setN(appState.cubeDimension)
  if (appState.selectedBinaryString) {
    hc.setSelectedBinaryString(appState.selectedBinaryString)
  }
})

watch(() => appState.cubeDimension, (val) => {
  if (hc.n.value !== val) hc.setN(val)
})

watch(() => appState.selectedBinaryString, (val) => {
  const currentBS = hc.selectedBinaryString.value
  if (val !== currentBS) {
    if (val === null) hc.clearSelection()
    else hc.setSelectedBinaryString(val)
  }
})

watch(hc.n, (val) => {
  if (val !== appState.cubeDimension) appState.setCubeDimension(val)
})

watch(hc.selectedBinaryString, (val) => {
  if (val !== appState.selectedBinaryString) {
    appState.setSelectedBinaryString(val)
  }
})
</script>

<template>
  <div class="flex h-full gap-2">
    <div class="flex-1 min-w-0 flex flex-col">
      <div ref="canvasContainer" class="flex-1 relative overflow-hidden rounded-xl">
        <HypercubeScene />
      </div>
    </div>
    <div class="w-72 shrink-0 hidden md:block">
      <InfoPanel />
    </div>
  </div>
  <VertexHUD />
</template>
