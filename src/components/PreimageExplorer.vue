<script setup>
import { inject, ref, computed, watch } from 'vue'
import { reduceRuns, isAlternating, getPreimagesForReducedString } from '../utils/cubeMath.js'
import { binomial } from '../utils/cubeMath.js'
import StarsBarsVisualizer from './StarsBarsVisualizer.vue'
import KaTeXFormula from './KaTeXFormula.vue'

const hc = inject('hypercube')

const inputY = ref('')
const currentCompIdx = ref(0)

watch(() => hc.selectedBinaryString.value, (val) => {
  if (val !== null) {
    const bits = val.split('').map(Number)
    inputY.value = reduceRuns(bits)
    currentCompIdx.value = 0
  }
})

function sanitizeY(e) {
  const val = e.target.value.replace(/[^01]/g, '')
  inputY.value = val
  currentCompIdx.value = 0
}

const preimageData = computed(() => {
  const y = inputY.value
  if (!y) return null
  return getPreimagesForReducedString(y, hc.n.value)
})

const yValid = computed(() => {
  if (!inputY.value) return true
  return isAlternating(inputY.value)
})

const currentComposition = computed(() => {
  if (!preimageData.value || preimageData.value.compositions.length === 0) return null
  return preimageData.value.compositions[currentCompIdx.value]
})

function prevComp() {
  if (currentCompIdx.value > 0) currentCompIdx.value--
}

function nextComp() {
  if (preimageData.value && currentCompIdx.value < preimageData.value.compositions.length - 1) {
    currentCompIdx.value++
  }
}

function highlightPreimage(label) {
  hc.setSelectedBinaryString(label)
}
</script>

<template>
  <div class="space-y-3">
    <div>
      <label class="text-[11px] text-slate-400 font-medium block mb-1">Reduced string y</label>
      <input
        type="text"
        :value="inputY"
        @input="sanitizeY"
        placeholder="e.g. 101"
        maxlength="9"
        class="w-full bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
      />
      <div v-if="!yValid && inputY" class="flex items-center gap-1 mt-1 text-[10px] text-amber-400">
        <span>⚠</span>
        <span>y must be alternating (no equal adjacent bits)</span>
      </div>
    </div>

    <template v-if="preimageData && yValid && inputY">
      <div class="flex items-center gap-3 text-xs text-slate-400">
        <span>k = <span class="font-mono text-blue-300">{{ preimageData.k }}</span></span>
        <span class="text-white/5">|</span>
        <span>n = <span class="font-mono text-slate-300">{{ hc.n.value }}</span></span>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <span class="text-slate-500">Count:</span>
        <span class="font-mono text-slate-300">{{ preimageData.count }}</span>
        <span class="text-slate-500">actual</span>
        <span class="text-slate-600">vs</span>
        <KaTeXFormula
          :formula="`C(${hc.n.value - 1}, ${preimageData.k - 1}) = ${preimageData.theoretical}`"
        />
        <span
          :class="[
            'text-[10px] font-mono px-1.5 py-0.5 rounded',
            preimageData.match ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40',
          ]"
        >
          {{ preimageData.match ? 'match' : 'mismatch' }}
        </span>
      </div>

      <StarsBarsVisualizer
        :n="hc.n.value"
        :k="preimageData.k"
        :composition="currentComposition"
        :currentIndex="currentCompIdx"
        :total="preimageData.compositions.length"
        :reducedString="inputY"
        @prev="prevComp"
        @next="nextComp"
      />

      <div class="text-xs text-slate-400 font-medium mt-2">Preimages</div>
      <div class="max-h-36 overflow-y-auto space-y-0.5">
        <div
          v-for="(x, i) in preimageData.preimages"
          :key="i"
          @click="highlightPreimage(x)"
          :class="[
            'font-mono text-xs px-2 py-1 rounded cursor-pointer transition-colors',
            hc.selectedBinaryString.value === x
              ? 'bg-blue-500/20 text-blue-300'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          ]"
        >
          {{ x }}
        </div>
      </div>
    </template>

    <div v-if="!inputY" class="text-center text-slate-600 text-xs py-6">
      Enter a reduced string y or click a vertex to auto-populate.
    </div>
  </div>
</template>
