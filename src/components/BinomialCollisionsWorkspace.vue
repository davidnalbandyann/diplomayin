<script setup>
import { ref, computed } from 'vue'
import { binomial, findCollisions, findNearCollisions, buildCollisionFrequencyMap } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const searchMaxN = ref(30)
const nearMaxN = ref(30)
const nearThreshold = ref(1)
const heatmapMaxN = ref(12)

const collisionResults = ref(null)
const nearResults = ref(null)
const heatmapMax = ref(12)
const selectedCollisionValue = ref(null)

const knownExamples = [
  { n1: 16, k1: 2, n2: 10, k2: 3, value: 120, type: 'collision' },
  { n1: 21, k1: 2, n2: 10, k2: 4, value: 210, type: 'collision' },
  { n1: 8, k1: 3, n2: 11, k2: 2, v1: 56, v2: 55, diff: 1, type: 'near' },
]

const collisionFrequency = computed(() => {
  if (!heatmapMax.value) return new Map()
  return buildCollisionFrequencyMap(heatmapMax.value)
})

function runSearch() {
  collisionResults.value = findCollisions(searchMaxN.value)
}

function runNearSearch() {
  nearResults.value = findNearCollisions(nearMaxN.value, nearThreshold.value)
}

function pascalTriangle(rows) {
  const tri = []
  for (let n = 0; n <= rows; n++) {
    const row = []
    for (let k = 0; k <= n; k++) {
      row.push({ n, k, value: binomial(n, k) })
    }
    tri.push(row)
  }
  return tri
}

const triangle = computed(() => pascalTriangle(heatmapMax.value))
const freqMap = computed(() => collisionFrequency.value)

function collisionLevel(val, n, k) {
  if (k > n / 2) return 'unique'
  const count = freqMap.value.get(val)
  if (!count || count < 2) return 'unique'
  return 'collision'
}

function selectCollision(val, n, k) {
  if (collisionLevel(val, n, k) !== 'collision') return
  selectedCollisionValue.value = selectedCollisionValue.value === val ? null : val
}

function clearSelection() {
  selectedCollisionValue.value = null
}

const selectedPairs = computed(() => {
  const val = selectedCollisionValue.value
  if (val === null) return []
  const pairs = []
  for (let n = 0; n <= heatmapMax.value; n++) {
    for (let k = 0; k <= n; k++) {
      if (binomial(n, k) === val) {
        pairs.push({ n, k })
      }
    }
  }
  return pairs
})
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Բինոմիալ բախումներ</h2>
      <p class="text-xs text-slate-500 mt-1">
        Exact collisions and near collisions between binomial coefficients
      </p>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200">Բացատրություն</h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Բինոմիալ բախում է կոչվում այն դեպքը, երբ երկու տարբեր բինոմիալ գործակիցներ հավասար են.
      </p>
      <div class="text-center py-1">
        <KaTeXFormula formula="C(n_1, k_1) = C(n_2, k_2), \quad (n_1, k_1) \neq (n_2, k_2)" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Գրեթե բախում է կոչվում այն դեպքը, երբ երկու բինոմիալ գործակիցների արժեքները տարբերվում են շատ փոքր չափով, օրինակ՝ 1-ով։
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        Այսպիսի դեպքերը ցույց են տալիս, որ կոմբինատոր «ծավալը» կարող է պահպանվել կամ գրեթե պահպանվել նույնիսկ պարամետրերի կտրուկ փոփոխության դեպքում։
      </p>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200">Հայտնի օրինակներ</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead>
            <tr class="text-slate-500 border-b border-white/5">
              <th class="text-left py-2 px-3 font-medium">C(n₁, k₁)</th>
              <th class="text-left py-2 px-3 font-medium">Արժեք</th>
              <th class="text-left py-2 px-3 font-medium">C(n₂, k₂)</th>
              <th class="text-left py-2 px-3 font-medium">Արժեք</th>
              <th class="text-left py-2 px-3 font-medium">Տարբերություն</th>
              <th class="text-left py-2 px-3 font-medium">Տիպ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ex, i) in knownExamples" :key="i"
              class="border-b border-white/[0.02]">
              <td class="py-1.5 px-3 font-mono text-slate-300">
                <KaTeXFormula :formula="`C(${ex.n1}, ${ex.k1})`" />
              </td>
              <td class="py-1.5 px-3 font-mono text-slate-400">{{ ex.type === 'near' ? ex.v1 : ex.value }}</td>
              <td class="py-1.5 px-3 font-mono text-slate-300">
                <KaTeXFormula :formula="`C(${ex.n2}, ${ex.k2})`" />
              </td>
              <td class="py-1.5 px-3 font-mono text-slate-400">{{ ex.type === 'near' ? ex.v2 : ex.value }}</td>
              <td class="py-1.5 px-3 font-mono text-slate-400">{{ ex.type === 'near' ? ex.diff : 0 }}</td>
              <td class="py-1.5 px-3">
                <span v-if="ex.type === 'collision'"
                  class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/20">
                  Հավասարում
                </span>
                <span v-else
                  class="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/20">
                  Գրեթե բախում
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Որոնել բախումներ</h3>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500">maxN</span>
          <input type="number" v-model.number="searchMaxN" min="3" max="50"
            class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <button @click="runSearch"
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/20">
          Գտնել բախումներ
        </button>
      </div>

      <div v-if="collisionResults" class="space-y-2">
        <div v-if="collisionResults.length === 0" class="text-xs text-slate-500 italic py-2">
          Բախումներ չեն գտնվել maxN = {{ searchMaxN }} միջակայքում:
        </div>
        <div v-for="(item, i) in collisionResults" :key="i"
          class="bg-slate-800/40 rounded-lg p-3 space-y-1">
          <div class="text-xs font-mono text-amber-300 font-medium">
            C({{ item.pairs[0].n }}, {{ item.pairs[0].k }}) = ... = {{ item.value.toLocaleString() }}
          </div>
          <div class="flex flex-wrap gap-1">
            <span v-for="(p, j) in item.pairs" :key="j"
              class="text-[10px] font-mono bg-slate-700/40 text-slate-400 px-1.5 py-0.5 rounded">
              C({{ p.n }}, {{ p.k }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Որոնել գրեթե բախումներ</h3>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500">maxN</span>
          <input type="number" v-model.number="nearMaxN" min="3" max="50"
            class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500">threshold</span>
          <input type="number" v-model.number="nearThreshold" min="1" max="100"
            class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <button @click="runNearSearch"
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/20">
          Գտնել գրեթե բախումներ
        </button>
      </div>

      <div v-if="nearResults" class="space-y-2">
        <div v-if="nearResults.length === 0" class="text-xs text-slate-500 italic py-2">
          Գրեթե բախումներ չեն գտնվել maxN = {{ nearMaxN }}, threshold = {{ nearThreshold }} պարամետրերով:
        </div>
        <div v-for="(item, i) in nearResults" :key="i"
          class="bg-slate-800/40 rounded-lg p-3">
          <div class="text-xs font-mono text-slate-300">
            <KaTeXFormula :formula="`C(${item.a.n}, ${item.a.k}) = ${item.a.value}`" />
            <span class="text-slate-500 mx-1">և</span>
            <KaTeXFormula :formula="`C(${item.b.n}, ${item.b.k}) = ${item.b.value}`" />
          </div>
          <div class="text-[10px] text-slate-500 mt-1">
            Տարբերություն՝ <span class="font-mono text-blue-300">{{ item.diff }}</span>
          </div>
        </div>
        <div v-if="nearResults.length > 0" class="text-[10px] text-slate-500">
              Գտնվել է {{ nearResults.length }} գրեթե բախում:
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Պասկալի եռանկյուն — ջերմային քարտեզ</h3>
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500">maxN</span>
          <input type="number" v-model.number="heatmapMax" min="3" max="30"
            class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
      </div>

      <div v-if="selectedCollisionValue !== null" class="flex items-center justify-between bg-blue-950/30 border border-blue-500/20 rounded-lg px-3 py-2">
        <span class="text-xs text-blue-300">
          Ընտրված է՝ արժեք = <strong>{{ selectedCollisionValue.toLocaleString() }}</strong>
          <span class="text-slate-500 ml-2">
            ({{ selectedPairs.length }} դիրք՝
            <span v-for="(p, i) in selectedPairs" :key="i" class="font-mono">
              C({{ p.n }},{{ p.k }})<template v-if="i < selectedPairs.length - 1">, </template>
            </span>
            )
          </span>
        </span>
        <button @click="clearSelection"
          class="text-[10px] px-2 py-0.5 rounded bg-slate-700/40 text-slate-400 hover:text-white transition-colors">
          Մաքրել
        </button>
      </div>

      <div class="overflow-x-auto py-2">
        <div class="flex flex-col items-center gap-0.5 min-w-max">
          <div v-for="(row, n) in triangle" :key="n" class="flex justify-center gap-0.5">
            <div
              v-for="(cell, k) in row" :key="k"
              :title="`C(${cell.n}, ${cell.k}) = ${cell.value.toLocaleString()}${collisionLevel(cell.value, cell.n, cell.k) === 'collision' ? '\nClick to select all matching values' : ''}`"
              :class="[
                'w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[8px] sm:text-[9px] font-mono rounded transition-colors',
                selectedCollisionValue === cell.value
                  ? 'text-white bg-blue-500/40 border border-blue-400/60 shadow-lg shadow-blue-500/20'
                  : cell.k === 0 || cell.k === cell.n
                    ? 'text-slate-600 cursor-default'
                    : collisionLevel(cell.value, cell.n, cell.k) === 'collision'
                      ? 'text-amber-200 bg-amber-500/20 border border-amber-500/30 cursor-pointer hover:bg-amber-500/30'
                      : 'text-slate-400 bg-slate-800/40 border border-transparent cursor-default',
              ]"
              @click="selectCollision(cell.value, cell.n, cell.k)"
            >
              {{ cell.value }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4 text-[10px] text-slate-500">
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-slate-800/40 border border-transparent inline-block"></span> Unique
        </span>
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30 inline-block"></span> Collision
        </span>
        <span class="flex items-center gap-1">
          <span class="w-3 h-3 rounded bg-blue-500/40 border border-blue-400/60 inline-block"></span> Selected
        </span>
      </div>
    </div>
  </div>
</template>
