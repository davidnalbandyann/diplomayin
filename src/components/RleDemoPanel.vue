<script setup>
import { inject, computed, watch, ref } from 'vue'
import { reduceRuns, getRunLengths, getRunCount, getCompressionStats } from '../utils/cubeMath.js'

const hc = inject('hypercube')

const inputStr = ref('')

watch(() => hc.selectedBinaryString.value, (val) => {
  if (val !== null) inputStr.value = val
})

function sanitizeBinary(e) {
  const val = e.target.value.replace(/[^01]/g, '')
  inputStr.value = val
}

function arrayToBits(arr) {
  return arr.map(n => String(n))
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
  return inputStr.value.length !== hc.n.value
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
  <div class="space-y-3">
    <div>
      <label class="text-[11px] text-slate-400 font-medium block mb-1">Երկուական x տողը</label>
      <input
        type="text"
        :value="inputStr"
        @input="sanitizeBinary"
        placeholder="օրինակ 111001"
        maxlength="9"
        class="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
      />
      <div v-if="lenMismatch" class="flex items-center gap-1 mt-1 text-[10px] text-amber-400">
        <span>⚠</span>
        <span>Երկարություն {{ inputStr.length }} ≠ n = {{ hc.n.value }}</span>
      </div>
    </div>

    <template v-if="inputStr && stats">
      <div class="bg-white/[0.03] rounded-lg p-3 space-y-2.5">
        <div class="text-xs text-slate-400">
          <span class="text-slate-500">x = </span>
          <span class="font-mono text-slate-200">{{ inputStr }}</span>
        </div>
        <div class="text-xs text-slate-400">
          <span class="text-slate-500">g(x) = </span>
          <span class="font-mono text-emerald-300">{{ gx }}</span>
        </div>
        <div class="text-xs text-slate-400">
          <span class="text-slate-500">Միատարր հատվածների երկարությունները = </span>
          <span class="font-mono text-slate-300">[{{ stats.runLengths.join(', ') }}]</span>
        </div>
        <div class="text-xs text-slate-400">
          <span class="text-slate-500">k = </span>
          <span class="font-mono text-blue-300">{{ stats.k }}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-1 font-mono text-sm">
        <template v-for="(seg, i) in runViz" :key="i">
          <span v-if="i > 0" class="text-blue-400 text-xs mx-0.5">|</span>
          <span :class="inputStr[seg.run[0]] === '1' ? 'text-slate-200' : 'text-slate-400'">{{ seg.run }}</span>
        </template>
      </div>

      <div class="bg-white/[0.03] rounded-lg p-3 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-500">Սեղմման գործակից</span>
          <span class="font-mono text-slate-300">{{ stats.k }}/{{ stats.n }} = {{ compressionPct }}%</span>
        </div>
        <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-300"
            :style="{
              width: compressionPct + '%',
              background: compressionPct > 70 ? '#db2777' : compressionPct > 50 ? '#ea580c' : '#059669',
            }"
          ></div>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-500">Խնայված (կամ Կրճատված)</span>
          <span class="font-mono text-emerald-400">{{ savedPct }}%</span>
        </div>
      </div>

      <div class="text-[10px] text-slate-500 leading-relaxed bg-slate-800/40 rounded-lg p-2.5 border border-white/5">
        Պատահական երկուական տողերը սովորաբար ունենում են k \approx n/2, ուստի RLE մեթոդն առավել արդյունավետ է, երբ առկա են երկար կրկնվող հատվածներ:
      </div>
    </template>

    <div v-if="!inputStr" class="text-center text-slate-600 text-xs py-6">
      Մուտքագրեք երկուական տող կամ սեղմեք գագաթի վրա՝ լրացնելու համար:
    </div>
  </div>
</template>
