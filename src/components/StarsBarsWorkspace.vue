<script setup>
import { inject, ref, computed, watch } from 'vue'
import { isAlternating, getPreimagesForReducedString } from '../utils/cubeMath.js'
import StarsBarsVisualizer from './StarsBarsVisualizer.vue'
import KaTeXFormula from './KaTeXFormula.vue'

const appState = inject('appState')

const inputY = ref('')
const currentCompIdx = ref(0)

watch(() => appState.selectedReducedString, (val) => {
  if (val !== null) {
    inputY.value = val
    currentCompIdx.value = 0
  }
})

function sanitizeY(e) {
  const val = e.target.value.replace(/[^01]/g, '')
  inputY.value = val
  currentCompIdx.value = 0
  if (val.length > 0 && isAlternating(val)) {
    appState.setSelectedReducedString(val)
  }
}

const yValid = computed(() => {
  if (!inputY.value) return true
  return isAlternating(inputY.value)
})

const preimageData = computed(() => {
  const y = inputY.value
  if (!y) return null
  return getPreimagesForReducedString(y, appState.dimension)
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
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Stars &amp; Bars</h2>
      <p class="text-xs text-slate-500 mt-1">
        Visualize why the number of preimages equals <span class="font-mono">C(n &minus; 1, k &minus; 1)</span>.
      </p>
    </div>

    <div class="flex flex-wrap items-end gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="text-xs text-slate-400 font-medium block mb-1.5">Reduced string y</label>
        <input
          type="text"
          :value="inputY"
          @input="sanitizeY"
          placeholder="e.g. 101"
          maxlength="9"
          class="w-full bg-slate-800/60 border border-white/10 rounded-lg px-4 py-3 text-base font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
        />
        <div v-if="!yValid && inputY" class="flex items-center gap-1 mt-1.5 text-xs text-amber-400">
          <span>⚠</span>
          <span>y must be alternating</span>
        </div>
      </div>
      <div class="text-xs text-slate-500">
        n = <span class="font-mono text-slate-300">{{ appState.dimension }}</span>
      </div>
    </div>

    <template v-if="preimageData && yValid && inputY && currentComposition">
      <StarsBarsVisualizer
        :n="appState.dimension"
        :k="preimageData.k"
        :composition="currentComposition"
        :currentIndex="currentCompIdx"
        :total="preimageData.compositions.length"
        :reducedString="inputY"
        @prev="prevComp"
        @next="nextComp"
      />

      <div class="bg-slate-800/40 rounded-xl p-4 border border-white/5 space-y-2 text-xs text-slate-400 leading-relaxed">
        <p>
          <strong class="text-slate-300">Why C(n–1, k–1)?</strong> There are <span class="font-mono text-slate-200">n</span> units (stars) and we need to split them into <span class="font-mono text-slate-200">k</span> positive groups. Between the <span class="font-mono text-slate-200">n</span> units there are <span class="font-mono text-slate-200">n – 1</span> gaps. Choosing <span class="font-mono text-slate-200">k – 1</span> of these gaps to place separators (bars) uniquely determines a composition.
        </p>
        <p>
          Each composition <span class="font-mono text-slate-200">[l₁, l₂, …, lₖ]</span> with <span class="font-mono text-slate-200">Σ lᵢ = n</span> and <span class="font-mono text-slate-200">lᵢ ≥ 1</span> corresponds to one preimage. Expanding <span class="font-mono text-slate-200">y</span> by repeating <span class="font-mono text-slate-200">y[i]</span> exactly <span class="font-mono text-slate-200">lᵢ</span> times gives <span class="font-mono text-slate-200">x</span>.
        </p>
        <div class="mt-2 text-center">
          <KaTeXFormula :formula="`\\text{count} = C(${appState.dimension} - 1, ${preimageData.k} - 1) = ${preimageData.theoretical}`" />
        </div>
      </div>
    </template>

    <div v-if="!inputY" class="text-center text-slate-600 text-sm py-12">
      Enter a reduced string y to explore compositions.
    </div>
  </div>
</template>
