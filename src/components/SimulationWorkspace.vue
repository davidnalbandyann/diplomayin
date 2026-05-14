<script setup>
import { inject, ref, computed, watch } from 'vue'
import { runCount, binomial } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const appState = inject('appState')

const sampleCount = ref(1000)
const lastResult = ref(null)
const frequencies = ref({})
const totalSims = ref(0)
const running = ref(false)

watch(() => appState.workspaceDimension, () => {
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
  const s = generateRandomString(appState.workspaceDimension)
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
    if (remaining > 0) requestAnimationFrame(chunk)
    else running.value = false
  }
  chunk()
}

function clearSim() {
  frequencies.value = {}
  totalSims.value = 0
  lastResult.value = null
}

function setSamples(val) {
  const n = parseInt(val)
  if (!isNaN(n) && n > 0) sampleCount.value = Math.min(n, 10000)
}

const tableEntries = computed(() => {
  const n = appState.workspaceDimension
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
  if (lastResult.value) appState.setSelectedBinaryString(lastResult.value.string)
}

const maxExpPct = computed(() => Math.max(...tableEntries.value.map(e => e.expPct), 1))
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Սիմուլյացիոն լաբորատորիա</h2>
      <p class="text-xs text-slate-500 mt-1">
        Համեմատեք պատահական երկուական տողերի միատարր հատվածների քանակի փորձնական և տեսական բաշխումները:
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        @click="generateOne"
        class="text-xs px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors font-medium"
      >
        Գեներացնել 1-ը
      </button>
      <button
        @click="runBatch(sampleCount)"
        :disabled="running"
        class="text-xs px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ running ? 'Ընթացքի մեջ է…' : `Գործարկել ${sampleCount}` }}
      </button>
      <input
        type="number"
        :value="sampleCount"
        @input="setSamples($event.target.value)"
        min="1"
        max="10000"
        class="w-20 bg-slate-800/60 border border-white/10 rounded-lg px-2 py-2 text-xs font-mono text-slate-200 text-center focus:outline-none focus:border-blue-500/40"
      />
      <button
        @click="clearSim"
        class="text-xs px-3 py-2 rounded text-slate-500 hover:text-slate-300 transition-colors"
      >
        Մաքրել
      </button>
    </div>

    <div v-if="lastResult" class="bg-white/[0.03] rounded-xl p-4 space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-500">Վերջին տողը</span>
        <span class="font-mono text-slate-200">{{ lastResult.string }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-500">Հատվածների քանակ</span>
        <span class="font-mono text-blue-300">k = {{ lastResult.k }}</span>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-500">g(x)</span>
        <span class="font-mono text-emerald-300">{{ appState.selectedReducedString }}</span>
      </div>
      <button
        @click="highlightLast"
        class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
      >
        Ընդգծել «Դասեր» ներդիրում →
      </button>
    </div>

    <template v-if="totalSims > 0">
      <div class="text-xs text-slate-500">
        Ընդհանուր սիմուլյացիաներ՝ <span class="font-mono text-slate-300">{{ totalSims }}</span>
      </div>

      <div class="bg-white/[0.03] rounded-xl p-4 space-y-2">
        <div class="flex items-stretch gap-1.5 h-24">
          <div
            v-for="e in tableEntries"
            :key="e.k"
            class="flex-1 flex flex-col items-center gap-0.5"
          >
            <div class="w-full relative flex-1">
              <div
                :style="{ height: (e.expPct / maxExpPct) * 100 + '%' }"
                class="absolute bottom-0 left-0.5 right-0.5 rounded-t bg-emerald-500/60"
              ></div>
            </div>
            <span class="text-[8px] font-mono text-slate-500">{{ e.k }}</span>
          </div>
        </div>
        <div class="text-[9px] text-slate-600 text-center">Փորձնական բաշխում</div>
      </div>

      <div class="bg-white/[0.03] rounded-xl overflow-hidden">
        <table class="w-full text-xs">
          <thead>
            <tr class="text-slate-500 border-b border-white/5">
              <th class="text-left py-2 px-3 font-medium">k</th>
              <th class="text-right px-2 py-2 font-medium">Քանակ</th>
              <th class="text-right px-2 py-2 font-medium">Փորձ. %</th>
              <th class="text-right px-3 py-2 font-medium">Տես. %</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in tableEntries"
              :key="e.k"
              class="border-b border-white/[0.02]"
            >
              <td class="py-1.5 px-3 font-mono text-slate-400">{{ e.k }}</td>
              <td class="text-right px-2 py-1.5 font-mono text-slate-300">{{ e.expCount }}</td>
              <td class="text-right px-2 py-1.5 font-mono text-slate-400">{{ e.expPct.toFixed(1) }}</td>
              <td class="text-right px-3 py-1.5 font-mono text-slate-400">{{ e.theoPct.toFixed(1) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="text-xs text-slate-500 text-center">
        <KaTeXFormula :formula="`P(K = k) = C(${appState.workspaceDimension} - 1, k - 1) \\; / \\; 2^{${appState.workspaceDimension} - 1}`" />
      </div>
    </template>

    <div v-if="totalSims === 0" class="text-center text-slate-600 text-sm py-12">
      Սիմուլյացիաներ առկա չեն: Գեներացրեք տող կամ գործարկեք խմբաքանակ:
    </div>
  </div>
</template>