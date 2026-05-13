<script setup>
import { ref, provide } from 'vue'
import { useHypercube } from './composables/useHypercube.js'
import HypercubeScene from './components/HypercubeScene.vue'
import InfoPanel from './components/InfoPanel.vue'

const canvasRef = ref(null)
const hc = useHypercube(canvasRef)
provide('hypercube', hc)
provide('canvasRef', canvasRef)
</script>

<template>
  <div class="h-screen w-screen bg-slate-950 text-white overflow-hidden flex flex-col">
    <div class="h-8 shrink-0 flex items-center px-4 border-b border-white/5">
      <span class="text-[11px] font-medium text-slate-400 tracking-wide">
        n-Dimensional Hypercube Visualizer
      </span>
    </div>
    <div class="flex-1 flex overflow-hidden p-2 gap-2">
      <div class="flex-1 min-w-0">
        <HypercubeScene />
      </div>
      <div class="w-72 shrink-0">
        <InfoPanel />
      </div>
    </div>
  </div>
</template>
