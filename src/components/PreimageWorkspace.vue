<script setup>
import { inject, ref, computed, watch } from 'vue'
import { reduceRuns, isAlternating, getPreimagesForReducedString } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const appState = inject('appState')

const inputY = ref('')

watch(() => appState.selectedReducedString, (val) => {
  if (val !== null) inputY.value = val
})

function sanitizeY(e) {
  const val = e.target.value.replace(/[^01]/g, '')
  inputY.value = val
  if (val.length > 0 && isAlternating(val)) {
    appState.setSelectedReducedString(val)
  }
}

const preimageData = computed(() => {
  const y = inputY.value
  if (!y) return null
  return getPreimagesForReducedString(y, appState.workspaceDimension)
})

const yValid = computed(() => {
  if (!inputY.value) return true
  return isAlternating(inputY.value)
})

function highlightPreimage(label) {
  appState.setSelectedBinaryString(label)
}
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Նախապատկերների հետազոտիչ</h2>
      <p class="text-xs text-slate-500 mt-1">
         Տրված է կրճատված y տողը և n չափողականությունը, գտնել բոլոր այն x-երը, որոնց համար g(x) = y:
      </p>
    </div>

    <div class="flex flex-wrap items-end gap-4">
      <div class="flex-1 min-w-[200px]">
        <label class="text-xs text-slate-400 font-medium block mb-1.5">Կրճատված y տողը</label>
        <input
          type="text"
          :value="inputY"
          @input="sanitizeY"
          placeholder="օրինակ 101"
          maxlength="9"
          class="w-full bg-slate-800/60 border border-white/10 rounded-lg px-4 py-3 text-base font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-colors"
        />
        <div v-if="!yValid && inputY" class="flex items-center gap-1 mt-1.5 text-xs text-amber-400">
          <span>⚠</span>
          <span>y-ը պետք է լինի հերթագայող (չունենա իրար հաջորդող հավասար բիթեր)</span>
        </div>
      </div>
      <div class="text-xs text-slate-500">
        n = <span class="font-mono text-slate-300">{{ appState.workspaceDimension }}</span>
      </div>
    </div>

    <template v-if="preimageData && yValid && inputY">
      <div class="flex flex-wrap items-center gap-3 text-sm">
        <span class="text-slate-500">k =</span>
        <span class="font-mono text-blue-300">{{ preimageData.k }}</span>
        <span class="text-white/5">|</span>
        <span class="text-slate-500">Քանակը՝:</span>
        <span class="font-mono text-slate-300">{{ preimageData.count }}</span>
        <span class="text-slate-500">փաստացի</span>
        <span class="text-slate-600">ընդդեմ</span>
        <KaTeXFormula :formula="`C(${appState.workspaceDimension - 1}, ${preimageData.k - 1}) = ${preimageData.theoretical}`" />
        <span
          :class="[
            'text-xs font-mono px-1.5 py-0.5 rounded',
            preimageData.match ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40',
          ]"
        >
          {{ preimageData.match ? 'համընկնում' : 'անհամապատասխանություն' }}
        </span>
      </div>

      <div class="bg-white/[0.03] rounded-xl p-4 space-y-2">
        <div class="text-xs text-slate-400 font-medium mb-2">պատկեր → Նախապատկեր</div>
        <div
          v-for="(x, i) in preimageData.preimages"
          :key="i"
          @click="highlightPreimage(x)"
          :class="[
            'flex items-center gap-3 font-mono text-sm px-3 py-2 rounded-lg cursor-pointer transition-colors',
            appState.selectedBinaryString === x
              ? 'bg-blue-500/20 text-blue-300'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
          ]"
        >
          <span class="text-[10px] text-slate-600 w-6 text-right">{{ i + 1 }}.</span>
          <span class="text-xs text-slate-500">[{{ preimageData.compositions[i].join(', ') }}]</span>
          <span class="text-slate-600">→</span>
          <span>{{ x }}</span>
        </div>
      </div>
    </template>

    <div v-if="!inputY" class="text-center text-slate-600 text-sm py-12">
      Մուտքագրեք կրճատված y տողը կամ սեղմեք գագաթի վրա «Դասեր» ներդիրում՝ ավտոմատ լրացման համար:
    </div>
  </div>
</template>
