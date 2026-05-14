<script setup>
import { ref, computed } from 'vue'
import { binomial } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const maxN = ref(12)
const selected = ref(null)

const triangle = computed(() => {
  const rows = []
  for (let n = 0; n <= maxN.value; n++) {
    const row = []
    for (let k = 0; k <= n; k++) {
      row.push({ n, k, value: binomial(n, k) })
    }
    rows.push(row)
  }
  return rows
})

const path = computed(() => {
  if (!selected.value) return null
  const { n, k } = selected.value
  if (k < 1) return null
  const entries = []
  for (let i = k; i <= n; i++) {
    entries.push({ n: i - 1, k: k - 1, value: binomial(i - 1, k - 1) })
  }
  return { entries, tip: { n, k, value: binomial(n, k) } }
})

function isOnPath(n, k) {
  if (!path.value) return false
  return path.value.entries.some(p => p.n === n && p.k === k)
}

function isTip(n, k) {
  if (!path.value) return false
  return path.value.tip.n === n && path.value.tip.k === k
}

function cellLevel(n, k) {
  if (k === 0 || k === n) return 'edge'
  if (isTip(n, k)) return 'tip'
  if (isOnPath(n, k)) return 'path'
  if (selected.value && k > selected.value.k) return 'dim'
  return 'normal'
}

function clickCell(n, k) {
  if (k < 1) return
  if (selected.value && selected.value.n === n && selected.value.k === k) {
    selected.value = null
  } else {
    selected.value = { n, k }
  }
}

const sumBreakdown = computed(() => {
  if (!path.value || path.value.entries.length === 0) return ''
  return path.value.entries.map(e => `C(${e.n},${e.k})`).join(' + ')
})

const cellSize = computed(() => maxN.value > 12 ? 'w-6 h-6 text-[7px] sm:w-7 sm:h-7 sm:text-[8px]' : 'w-7 h-7 text-[8px] sm:w-8 sm:h-8 sm:text-[9px]')
</script>

<template>
  <div class="bg-slate-800/40 rounded-xl p-4 space-y-3">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <span class="text-[11px] font-medium text-slate-400">Պասկալի եռանկյուն — Հոկեյի մական</span>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-slate-500">maxN</span>
          <input type="range" v-model.number="maxN" min="5" max="15"
            class="w-16 sm:w-20 cursor-pointer" />
          <span class="text-[10px] font-mono text-slate-300 w-4">{{ maxN }}</span>
        </div>
        <button v-if="selected" @click="selected = null"
          class="text-[10px] px-2 py-0.5 rounded bg-slate-700/40 text-slate-400 hover:text-white transition-colors">
          Մաքրել
        </button>
      </div>
    </div>

    <div v-if="path && path.entries.length > 0" class="bg-slate-900/50 rounded-lg p-3 text-center space-y-1.5">
      <div class="text-[10px] text-slate-400 font-mono leading-relaxed">
        {{ sumBreakdown }}
      </div>
      <div class="text-xs text-slate-300">
        <KaTeXFormula :formula="`\\sum_{i=${path.entries[0].k}}^{${path.tip.n}} C(i, ${path.entries[0].k}) = C(${path.tip.n}, ${path.tip.k}) = ${path.tip.value.toLocaleString()}`" />
      </div>
    </div>
    <div v-else class="text-[10px] text-slate-500 text-center">
      Սեղմեք որևէ C(n,k) բջիջի վրա (k ≥ 1)՝ տեսնելու հոկեյի մականի ուղին
    </div>

    <div class="overflow-x-auto py-1 -mx-1">
      <div class="flex flex-col items-center gap-0.5 min-w-max px-2">
        <div v-for="(row, n) in triangle" :key="n" class="flex justify-center gap-0.5">
          <div
            v-for="(cell, k) in row" :key="k"
            :title="`C(${cell.n}, ${cell.k}) = ${cell.value.toLocaleString()}${k >= 1 ? '\nՍեղմեք՝ հոկեյի մականի ուղին տեսնելու համար' : ''}`"
            :class="[
              'flex items-center justify-center font-mono rounded transition-all duration-300',
              cellSize,
              cellLevel(cell.n, cell.k) === 'tip'
                ? 'text-white bg-blue-500/50 border border-blue-400/70 shadow-lg shadow-blue-500/30 scale-110 z-10'
                : cellLevel(cell.n, cell.k) === 'path'
                  ? 'text-amber-200 bg-amber-500/30 border border-amber-400/50 cursor-pointer hover:bg-amber-500/40'
                  : cellLevel(cell.n, cell.k) === 'edge'
                    ? 'text-slate-600 cursor-default'
                    : cellLevel(cell.n, cell.k) === 'dim'
                      ? 'text-slate-600 bg-slate-800/20 border border-transparent'
                      : 'text-slate-400 bg-slate-800/40 border border-transparent cursor-pointer hover:bg-slate-700/40',
            ]"
            @click="clickCell(cell.n, cell.k)"
          >
            {{ cell.value }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
      <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-400/50 inline-block"></span> Անկյունագիծ (մական)</span>
      <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-blue-500/50 border border-blue-400/70 inline-block"></span> C(n,k) ծայր</span>
      <span class="text-slate-600">|</span>
      <span class="text-slate-600">maxN = {{ maxN }}, 2<sup>{{ maxN }}</sup> ≈ {{ Math.pow(2, maxN).toLocaleString() }}</span>
    </div>
  </div>
</template>
