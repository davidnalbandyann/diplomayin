<script setup>
import { inject } from 'vue'

const canvasRef = inject('canvasRef')
const hc = inject('hypercube')

const GRADIENT_STOPS = ['#3b82f6', '#06b6d4', '#10b981', '#eab308', '#f97316', '#ef4444']
const gradientCss = `linear-gradient(to right, ${GRADIENT_STOPS.join(', ')})`
</script>

<template>
  <div class="flex flex-col h-full">
    <div ref="canvasRef" class="flex-1 relative overflow-hidden rounded-xl">
      <div
        class="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 glass-panel rounded-lg px-5 py-3 flex items-center gap-5"
      >
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-slate-400">n =</span>
          <span class="text-lg font-bold text-blue-400 tabular-nums min-w-[2ch] text-center">{{ hc.n.value }}</span>
          <input
            type="range"
            min="1"
            max="6"
            :value="hc.n.value"
            @input="hc.setN(parseInt($event.target.value))"
            class="w-24 cursor-pointer"
          />
        </div>
        <div class="w-px h-5 bg-white/5"></div>
        <label class="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            :checked="hc.autoRotate.value"
            @change="hc.toggleAutoRotate()"
            class="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          Rotate
        </label>
        <div v-if="hc.isTransitioning.value" class="text-[10px] text-slate-500 animate-pulse">settling...</div>
      </div>

      <div
        class="absolute bottom-5 right-5 z-10 glass-panel rounded-lg px-3 py-1.5 flex items-center gap-2"
      >
        <span class="text-[10px] text-slate-400 font-mono">k=1</span>
        <div class="w-16 h-2 rounded-sm" :style="{ background: gradientCss }"></div>
        <span class="text-[10px] text-slate-400 font-mono">k=n</span>
      </div>

      <div
        v-if="hc.selectedK.value !== null"
        class="absolute top-4 left-4 z-10 glass-panel rounded-lg px-3 py-1.5 text-xs text-slate-300"
      >
        k = <span class="text-blue-300 font-semibold font-mono">{{ hc.selectedK.value }}</span>
        <button @click="hc.clearSelection()" class="ml-2 text-slate-500 hover:text-slate-300 transition-colors">✕</button>
      </div>
    </div>
  </div>
</template>
