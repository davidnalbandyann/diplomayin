<script setup>
import { inject } from 'vue'

const hc = inject('hypercube')

const GRADIENT_STOPS = ['#3b82f6', '#06b6d4', '#10b981', '#eab308', '#f97316', '#ef4444']
const gradientCss = `linear-gradient(to right, ${GRADIENT_STOPS.join(', ')})`
</script>

<template>
  <div
    class="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-10 glass-panel rounded-lg px-3 sm:px-5 py-2 sm:py-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-5 max-w-[95vw] sm:max-w-none"
  >
    <label class="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 cursor-pointer select-none">
      <input
        type="checkbox"
        :checked="hc.autoRotate.value"
        @change="hc.toggleAutoRotate()"
        class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
      />
      Rotate
    </label>
    <div v-if="hc.isTransitioning.value" class="text-[10px] text-slate-500 animate-pulse">settling...</div>
    <div class="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
      <button
        :class="[
          'text-[10px] px-2 py-1 rounded-md transition-all font-medium',
          hc.layoutMode.value === 'standard'
            ? 'bg-blue-500/20 text-blue-300'
            : 'text-slate-500 hover:text-slate-300'
        ]"
        @click="hc.setLayoutMode('standard')"
      >Standard</button>
      <button
        :class="[
          'text-[10px] px-2 py-1 rounded-md transition-all font-medium',
          hc.layoutMode.value === 'shell'
            ? 'bg-blue-500/20 text-blue-300'
            : 'text-slate-500 hover:text-slate-300'
        ]"
        @click="hc.setLayoutMode('shell')"
      >Shell</button>
    </div>
    <button
      :class="[
        'text-[10px] px-2 py-1 rounded-md transition-all font-medium',
        hc.showPath.value
          ? 'bg-amber-500/20 text-amber-300'
          : 'text-slate-500 hover:text-slate-300'
      ]"
      @click="hc.togglePath()"
    >Path</button>
    <div class="flex sm:hidden items-center gap-1 bg-white/5 rounded-lg p-0.5">
      <button
        :class="[
          'text-[9px] px-1.5 py-0.5 rounded-md transition-all font-medium',
          hc.layoutMode.value === 'standard'
            ? 'bg-blue-500/20 text-blue-300'
            : 'text-slate-500 hover:text-slate-300'
        ]"
        @click="hc.setLayoutMode('standard')"
      >Std</button>
      <button
        :class="[
          'text-[9px] px-1.5 py-0.5 rounded-md transition-all font-medium',
          hc.layoutMode.value === 'shell'
            ? 'bg-blue-500/20 text-blue-300'
            : 'text-slate-500 hover:text-slate-300'
        ]"
        @click="hc.setLayoutMode('shell')"
      >Shell</button>
    </div>
    <div class="flex sm:hidden items-center gap-1.5 glass-panel rounded px-2 py-0.5">
      <span class="text-[9px] text-slate-400 font-mono">k=1</span>
      <div class="w-10 h-1.5 rounded-sm" :style="{ background: gradientCss }"></div>
      <span class="text-[9px] text-slate-400 font-mono">k=n</span>
    </div>
  </div>

  <div
    class="absolute bottom-5 right-5 z-10 glass-panel rounded-lg px-3 py-1.5 items-center gap-2 hidden sm:flex"
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
</template>
