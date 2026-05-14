<script setup>
import { inject, computed, watch, ref } from 'vue'
import { reduceRuns, getRunLengths, getRunCount, getCompressionStats } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const appState = inject('appState')

const inputStr = ref('')

watch(() => appState.selectedBinaryString, (val) => {
  if (val !== null) inputStr.value = val
})

function sanitizeBinary(e) {
  const val = e.target.value.replace(/[^01]/g, '')
  inputStr.value = val
    if (val.length === appState.workspaceDimension) {
    appState.setSelectedBinaryString(val)
  }
}

const stats = computed(() => {
  const s = inputStr.value
  if (!s) return null
  return getCompressionStats(s.split('').map(Number))
})

const gx = computed(() => {
  if (!inputStr.value) return ''
  return reduceRuns(inputStr.value.split('').map(Number))
})

const runViz = computed(() => {
  const rl = getRunLengths(inputStr.value.split('').map(Number))
  if (!rl.length) return []
  const result = []
  let idx = 0
  for (let i = 0; i < rl.length; i++) {
    result.push({ run: inputStr.value.slice(idx, idx + rl[i]), index: i })
    idx += rl[i]
  }
  return result
})

const lenMismatch = computed(() => {
  if (!inputStr.value) return false
  return inputStr.value.length !== appState.workspaceDimension
})

const compressionPct = computed(() => {
  if (!stats.value || stats.value.n === 0) return 0
  return Math.round(stats.value.ratio * 100)
})

const savedPct = computed(() => {
  if (!stats.value || stats.value.n === 0) return 0
  return Math.round(stats.value.saved * 100)
})
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Միատարր հատվածների երկարության կրճատում</h2>
      <p class="text-xs text-slate-500 mt-1">
        g(x) օպերատորը յուրաքանչյուր առավելագույն միատարր հատված փոխարինում է մեկ բիթով՝ ստանալով հերթագայող կրճատված տող։
      </p>
    </div>

    <div>
      <label class="text-xs text-slate-400 font-medium block mb-1.5">Երկուական x տող (երկարությունը n = {{ appState.workspaceDimension }})</label>
      <input
        type="text"
        :value="inputStr"
        @input="sanitizeBinary"
        placeholder="օրինակ՝ 111001"
        :maxlength="appState.workspaceDimension"
        class="w-full max-w-sm bg-slate-800/60 border border-white/10 rounded-lg px-4 py-3 text-base font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
      />
      <div v-if="lenMismatch" class="flex items-center gap-1 mt-1.5 text-xs text-amber-400">
        <span>⚠</span>
        <span>Երկարությունը {{ inputStr.length }} ≠ n = {{ appState.workspaceDimension }}</span>
      </div>
    </div>

    <template v-if="inputStr && stats">
      <div class="bg-white/[0.03] rounded-xl p-6 space-y-6">
        <div class="text-center space-y-3">
          <div class="flex flex-wrap items-center justify-center gap-1.5 font-mono text-xl">
            <span class="text-slate-500 text-xs mr-2 self-center">x =</span>
            <template v-for="(seg, i) in runViz" :key="i">
              <span
                :class="[
                  'px-3 py-1.5 rounded-md border',
                  inputStr[seg.run[0]] === '1'
                    ? 'bg-blue-950/40 border-blue-500/30 text-slate-200'
                    : 'bg-slate-800/60 border-slate-700/40 text-slate-400',
                ]"
              >{{ seg.run }}</span>
              <span v-if="i < runViz.length - 1" class="text-blue-400 text-lg mx-1">│</span>
            </template>
          </div>

          <div class="flex items-center justify-center gap-1 text-lg text-slate-600">
            <template v-for="(seg, i) in runViz" :key="'arr' + i">
              <span class="text-xs">↓</span>
              <span v-if="i < runViz.length - 1" class="text-blue-400 mx-1 opacity-30">│</span>
            </template>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-2 font-mono text-lg">
            <span class="text-slate-500 text-xs mr-2 self-center">g(x) =</span>
            <span
              v-for="(ch, i) in gx"
              :key="'g' + i"
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border',
                ch === '1'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800/60 border-slate-600/40 text-slate-300',
              ]"
            >{{ ch }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-slate-800/40 rounded-lg p-3 text-center">
            <div class="text-[10px] text-slate-500 uppercase tracking-wide">k</div>
            <div class="text-lg font-mono text-blue-300 mt-1">{{ stats.k }}</div>
          </div>
          <div class="bg-slate-800/40 rounded-lg p-3 text-center">
            <div class="text-[10px] text-slate-500 uppercase tracking-wide">Հատվածներ</div>
            <div class="text-lg font-mono text-slate-300 mt-1">[{{ stats.runLengths.join(', ') }}]</div>
          </div>
          <div class="bg-slate-800/40 rounded-lg p-3 text-center">
            <div class="text-[10px] text-slate-500 uppercase tracking-wide">Հարաբերակցություն</div>
            <div class="text-lg font-mono text-slate-300 mt-1">{{ stats.k }}/{{ stats.n }}</div>
          </div>
          <div class="bg-slate-800/40 rounded-lg p-3 text-center">
            <div class="text-[10px] text-slate-500 uppercase tracking-wide">Խնայված</div>
            <div class="text-lg font-mono text-emerald-400 mt-1">{{ savedPct }}%</div>
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-500">Սեղմման գործակից</span>
            <span class="font-mono text-slate-300">{{ stats.k }}/{{ stats.n }} = {{ compressionPct }}%</span>
          </div>
          <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: compressionPct + '%',
                background: compressionPct > 70 ? '#ef4444' : compressionPct > 50 ? '#f97316' : '#10b981',
              }"
            ></div>
          </div>
        </div>

        <div class="text-xs text-slate-500 leading-relaxed bg-slate-800/40 rounded-lg p-3 border border-white/5">
          Պատահական երկուական տողերը սովորաբար ունենում են k ≈ n/2, ուստի RLE-ն առավել արդյունավետ է, երբ առկա են երկար կրկնվող հատվածներ:
        </div>
      </div>
    </template>

    <div v-if="!inputStr" class="text-center text-slate-600 text-sm py-12">
      Մուտքագրեք երկուական տող կամ սեղմեք գագաթի վրա «Դասեր» ներդիրում՝ լրացնելու համար:
    </div>
  </div>
</template>