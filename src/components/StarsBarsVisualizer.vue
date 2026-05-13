<script setup>
import { computed } from 'vue'
import { binomial } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const props = defineProps({
  n: { type: Number, required: true },
  k: { type: Number, required: true },
  composition: { type: Array, default: null },
  currentIndex: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  reducedString: { type: String, default: '' },
})

const emit = defineEmits(['prev', 'next'])

const binomVal = computed(() => binomial(props.n - 1, props.k - 1))
</script>

<template>
  <div class="bg-white/[0.03] rounded-lg p-3 space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-[11px] font-medium text-slate-400">Stars &amp; Bars</span>
      <span v-if="total > 0" class="text-[10px] text-slate-500 font-mono">
        Composition {{ currentIndex + 1 }} / {{ total }}
      </span>
    </div>

    <div v-if="composition" class="space-y-2">
      <div class="flex flex-wrap items-center gap-0.5 text-lg leading-relaxed font-mono justify-center py-2">
        <template v-for="(part, i) in composition" :key="i">
          <span v-if="i > 0" class="text-blue-400 mx-1 text-xl font-light">│</span>
          <span v-for="j in part" :key="j" class="text-slate-300">●</span>
        </template>
      </div>

      <div v-if="reducedString" class="space-y-1">
        <div class="flex flex-wrap items-center gap-0.5 font-mono text-xs justify-center">
          <template v-for="(part, i) in composition" :key="'e' + i">
            <span v-if="i > 0" class="text-blue-400 mx-0.5">|</span>
            <span
              v-for="j in part" :key="j"
              :class="reducedString[i] === '1' ? 'text-slate-200' : 'text-slate-400'"
            >{{ reducedString[i] }}</span>
          </template>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2">
        <button
          @click="emit('prev')"
          :disabled="currentIndex === 0"
          class="text-[10px] px-3 py-1 rounded-md bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >Previous</button>
        <button
          @click="emit('next')"
          :disabled="currentIndex === total - 1"
          class="text-[10px] px-3 py-1 rounded-md bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >Next</button>
      </div>
    </div>

    <div v-if="n > 0 && k > 0" class="text-center text-[11px] text-slate-500">
      <KaTeXFormula :formula="`C(${n - 1}, ${k - 1}) = ${binomVal}`" />
    </div>
  </div>
</template>
