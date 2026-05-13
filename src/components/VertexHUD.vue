<script setup>
import { inject, ref, computed, watch } from 'vue'
import { aggregationVector } from '../utils/cubeMath.js'

const hc = inject('hypercube')

const pos = ref({ x: 0, y: 0 })
const visible = ref(false)

watch(() => hc.hoveredVertex.value, (v) => {
  visible.value = v !== null
})

const aggVec = computed(() => {
  if (!hc.hoveredVertex.value) return []
  return aggregationVector(hc.hoveredVertex.value.bits)
})

function onMouse(e) {
  pos.value = { x: e.clientX, y: e.clientY }
}

if (typeof document !== 'undefined') {
  document.addEventListener('mousemove', onMouse)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="hud">
      <div
        v-if="visible && hc.hoveredVertex.value"
        class="fixed z-[60] pointer-events-none"
        :style="{ left: pos.x + 16 + 'px', top: pos.y - 10 + 'px' }"
      >
        <div class="glass-panel-strong rounded-lg px-4 py-3 text-xs space-y-1.5 min-w-[160px]">
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Binary</span>
            <span class="font-mono text-slate-200">{{ hc.hoveredVertex.value.label }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">Run count</span>
            <span class="font-mono text-blue-300 font-semibold">k = {{ hc.hoveredVertex.value.k }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-slate-400">g(x)</span>
            <span class="font-mono text-emerald-300">[{{ aggVec.join(', ') }}]</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.hud-enter-active, .hud-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.hud-enter-from, .hud-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
