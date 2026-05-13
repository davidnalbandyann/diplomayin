<script setup>
import { inject, ref, computed, watch } from 'vue'
import { runCount, binomial } from '../utils/cubeMath.js'

const hc = inject('hypercube')

const sampleCount = ref(1000)
const lastResult = ref(null)
const frequencies = ref({})
const totalSims = ref(0)
const running = ref(false)

watch(() => hc.n.value, () => {
  frequencies.value = {}
  totalSims.value = 0
  lastResult.value = null
})

function generateRandomString(length) {
  let s = ''
  for (let i = 0; i < length; i++) {
    s += Math.random() < 0.5 ? '0' : '1'
  }
  return s
}

function runSingle() {
  const s = generateRandomString(hc.n.value)
  const k = runCount(s.split('').map(Number))
  return { string: s, k }
}

function generateOne() {
  const result = runSingle()
  lastResult.value = result
  frequencies.value[result.k] = (frequencies.value[result.k] || 0) + 1
  totalSims.value++
}

function runBatch(count) {
  running.value = true
  const batch = Math.min(count, 500)
  let remaining = count
  function chunk() {
    const n = Math.min(batch, remaining)
    for (let i = 0; i < n; i++) {
      const r = runSingle()
      frequencies.value[r.k] = (frequencies.value[r.k] || 0) + 1
      totalSims.value++
    }
    remaining -= n
    if (remaining > 0) {
      requestAnimationFrame(chunk)
    } else {
      running.value = false
    }
  }
  chunk()
}

function clearSim() {
  frequencies.value = {}
  totalSims.value = 0
  lastResult.value = null
}

const tableEntries = computed(() => {
  const n = hc.n.value
  const total = totalSims.value
  const entries = []
  for (let k = 1; k <= n; k++) {
    const expCount = frequencies.value[k] || 0
    const expPct = total > 0 ? (expCount / total) * 100 : 0
    const theoPct = (binomial(n - 1, k - 1) / Math.pow(2, n - 1)) * 100
    entries.push({ k, expCount, expPct, theoPct })
  }
  return entries
})

function highlightLast() {
  if (lastResult.value) {
    hc.setSelectedBinaryString(lastResult.value.string)
  }
}

function setSamples(val) {
  const n = parseInt(val)
  if (!isNaN(n) && n > 0) sampleCount.value = Math.min(n, 10000)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <button
        @click="generateOne"
        class="text-[11px] px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors font-medium"
      >
        Generate 1
      </button>
      <button
        @click="runBatch(sampleCount)"
        :disabled="running"
        class="text-[11px] px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ running ? 'Running...' : `Run ${sampleCount}` }}
      </button>
      <input
        type="number"
        :value="sampleCount"
        @input="setSamples($event.target.value)"
        min="1"
        max="10000"
        class="w-16 bg-slate-800/60 border border-white/10 rounded-lg px-2 py-1.5 text-xs font-mono text-slate-200 text-center focus:outline-none focus:border-blue-500/40"
      />
      <button
        @click="clearSim"
        class="text-[10px] px-2 py-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
      >
        Clear
      </button>
    </div>

    <div v-if="lastResult" class="bg-white/[0.03] rounded-lg p-2.5 space-y-1">
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-slate-500">Last string</span>
        <span class="font-mono text-xs text-slate-200">{{ lastResult.string }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-slate-500">Run count</span>
        <span class="font-mono text-sm text-blue-300">k = {{ lastResult.k }}</span>
      </div>
      <button
        @click="highlightLast"
        class="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
      >
        Highlight in scene
      </button>
    </div>

    <div v-if="totalSims > 0" class="text-[10px] text-slate-500">
      Total simulations: {{ totalSims }}
    </div>

    <div v-if="totalSims > 0" class="overflow-x-auto">
      <table class="w-full text-[10px]">
        <thead>
          <tr class="text-slate-500 border-b border-white/5">
            <th class="text-left py-1 pr-2 font-medium">k</th>
            <th class="text-right px-2 py-1 font-medium">Count</th>
            <th class="text-right px-2 py-1 font-medium">Exp. %</th>
            <th class="text-right px-2 py-1 font-medium">Theo. %</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="e in tableEntries"
            :key="e.k"
            class="border-b border-white/[0.02]"
          >
            <td class="py-1 pr-2 font-mono text-slate-400">{{ e.k }}</td>
            <td class="text-right px-2 py-1 font-mono text-slate-300">{{ e.expCount }}</td>
            <td class="text-right px-2 py-1 font-mono text-slate-400">{{ e.expPct.toFixed(1) }}</td>
            <td class="text-right px-2 py-1 font-mono text-slate-400">{{ e.theoPct.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalSims === 0" class="text-center text-slate-600 text-xs py-6">
      No simulations yet. Generate a string or run a batch.
    </div>
  </div>
</template>
