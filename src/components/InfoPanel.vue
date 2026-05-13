<script setup>
import { inject, computed } from 'vue'
import { colorForK } from '../utils/cubeMath.js'

const hc = inject('hypercube')

const entries = computed(() => {
  const map = hc.groups.value
  if (!map || map.size === 0) return []
  const result = []
  for (let k = 1; k <= hc.n.value; k++) {
    const g = map.get(k)
    if (g) {
      result.push({ ...g, highlighted: hc.selectedK.value === k })
    }
  }
  return result
})

const maxTheoretical = computed(() => {
  if (entries.value.length === 0) return 1
  return Math.max(...entries.value.map(e => e.theoretical))
})

const selectedVertex = computed(() => {
  const k = hc.selectedK.value
  if (k === null) return null
  const map = hc.groups.value
  if (!map) return null
  const g = map.get(k)
  if (!g || g.vertices.length === 0) return null
  return g.vertices[0]
})

function toggleK(k) {
  if (hc.selectedK.value === k) {
    hc.clearSelection()
  } else {
    hc.setSelectedK(k)
  }
}

function runBreakdown(vertex) {
  if (!vertex) return []
  const bits = vertex.bits
  const result = []
  for (let i = 0; i < bits.length; i++) {
    const isBoundary = i > 0 && bits[i] !== bits[i - 1]
    result.push({ bit: bits[i], isBoundary })
  }
  return result
}
</script>

<template>
  <div class="h-full flex flex-col glass-panel-strong rounded-xl overflow-hidden">
    <div class="px-4 py-3 border-b border-white/5">
      <h2 class="text-sm font-semibold text-slate-200">Equivalence Classes</h2>
      <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
        Vertices are grouped by <span class="text-blue-300">run count</span>
        <span class="font-math text-slate-300 ml-1">k</span> —
        the number of maximal consecutive runs of the same bit.
      </p>
    </div>

    <div class="px-4 pt-3 pb-2 border-b border-white/5">
      <div class="flex items-stretch gap-1.5 h-20">
        <div
          v-for="entry in entries"
          :key="'bar-' + entry.k"
          class="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
          @click="toggleK(entry.k)"
        >
          <div class="w-full relative" style="flex:1">
            <div
              :style="{
                height: (entry.theoretical / maxTheoretical) * 100 + '%',
                background: colorForK(entry.k, hc.n.value),
              }"
              :class="[
                'absolute bottom-0 left-0 right-0 rounded-t transition-all duration-300',
                entry.highlighted
                  ? 'opacity-100 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                  : 'opacity-60 group-hover:opacity-80'
              ]"
            ></div>
          </div>
          <span
            :class="[
              'text-[9px] font-mono transition-colors',
              entry.highlighted ? 'text-blue-300' : 'text-slate-500'
            ]"
          >k={{ entry.k }}</span>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-3 py-2 space-y-1">
      <div
        v-for="entry in entries"
        :key="entry.k"
        :class="[
          'rounded-lg px-3 py-2 transition-all duration-300 cursor-pointer border',
          entry.highlighted
            ? 'bg-blue-950/40 border-blue-400/30'
            : 'bg-white/[0.02] border-transparent hover:bg-white/[0.04]',
        ]"
        @click="toggleK(entry.k)"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-slate-300">
            <span class="font-math">k</span> = <span class="font-mono">{{ entry.k }}</span>
          </span>
          <span
            :class="[
              'text-[10px] font-mono px-1.5 py-0.5 rounded',
              entry.match ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40',
            ]"
          >
            {{ entry.match ? 'match' : 'mismatch' }}
          </span>
        </div>

        <div class="flex items-center gap-2 text-[11px] text-slate-500">
          <span>
            |H| = <span class="font-math">{{ entry.theoretical }}</span>
          </span>
          <span class="text-white/5">|</span>
          <span>
            found <span class="font-mono text-slate-300">{{ entry.actual }}</span>
          </span>
        </div>

        <div v-if="entry.highlighted" class="mt-2 pt-2 border-t border-white/5 space-y-1.5">
          <div class="text-[10px] text-slate-500">
            Formula:
            <span class="font-math text-slate-300">
              |H({{ entry.k }}, {{ hc.n.value }})| = 2 &middot; C({{ hc.n.value - 1 }}, {{ entry.k - 1 }}) = {{ entry.theoretical }}
            </span>
          </div>
          <div v-if="selectedVertex" class="text-[10px] text-slate-500">
            Runs in <span class="font-mono text-slate-300">{{ selectedVertex.label }}</span>:
            <div class="flex items-center gap-0 mt-0.5 font-mono text-[11px]">
              <template v-for="(rb, i) in runBreakdown(selectedVertex)" :key="i">
                <span v-if="rb.isBoundary" class="text-blue-400 mx-0.5">|</span>
                <span :class="rb.bit === 1 ? 'text-slate-200' : 'text-slate-400'">{{ rb.bit }}</span>
              </template>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1 mt-1 flex-wrap">
          <span
            v-for="v in entry.vertices"
            :key="v.id"
            class="font-mono text-[9px] px-1 py-[1px] rounded bg-white/5 text-slate-500"
          >
            {{ v.label }}
          </span>
        </div>
      </div>

      <div v-if="entries.length === 0" class="text-center text-slate-600 text-xs py-8">
        No data
      </div>
    </div>

    <div class="px-4 py-2.5 border-t border-white/5 text-[10px] text-slate-500 text-center font-math">
      |H(k, n)| = 2 &middot; C(n &minus; 1, k &minus; 1)
    </div>
  </div>
</template>
