<script setup>
import { ref, computed } from 'vue'
import { binomial } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const n1 = ref(16)
const k1 = ref(2)
const n2 = ref(10)
const k2 = ref(3)

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v || min))
}

function setN1(e) { n1.value = clamp(parseInt(e.target.value), 1, 50) }
function setK1(e) { k1.value = clamp(parseInt(e.target.value), 0, n1.value) }
function setN2(e) { n2.value = clamp(parseInt(e.target.value), 1, 50) }
function setK2(e) { k2.value = clamp(parseInt(e.target.value), 0, n2.value) }

const val1 = computed(() => binomial(n1.value, k1.value))
const val2 = computed(() => binomial(n2.value, k2.value))
const areEqual = computed(() => val1.value === val2.value)

function loadExample(n1v, k1v, n2v, k2v) {
  n1.value = n1v; k1.value = k1v
  n2.value = n2v; k2.value = k2v
}
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Բինոմիալ իզոմորֆություն</h2>
      <p class="text-xs text-slate-500 mt-1">
        Cardinality-based isomorphism between equivalence classes with equal binomial coefficients
      </p>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Հաշվիչ</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <span class="text-xs text-slate-400 font-medium">C(n₁, k₁)</span>
          <div class="flex items-center gap-2">
            <label class="text-[10px] text-slate-500 w-4">n</label>
            <input type="number" :value="n1" @input="setN1" min="1" max="50"
              class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <label class="text-[10px] text-slate-500 w-3">k</label>
            <input type="number" :value="k1" @input="setK1" min="0" max="50"
              class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div class="text-xs text-slate-300 font-mono bg-slate-800/40 rounded-lg p-2 text-center">
            <KaTeXFormula :formula="`C(${n1}, ${k1}) = ${val1.toLocaleString()}`" />
          </div>
        </div>
        <div class="space-y-2">
          <span class="text-xs text-slate-400 font-medium">C(n₂, k₂)</span>
          <div class="flex items-center gap-2">
            <label class="text-[10px] text-slate-500 w-4">n</label>
            <input type="number" :value="n2" @input="setN2" min="1" max="50"
              class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <label class="text-[10px] text-slate-500 w-3">k</label>
            <input type="number" :value="k2" @input="setK2" min="0" max="50"
              class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div class="text-xs text-slate-300 font-mono bg-slate-800/40 rounded-lg p-2 text-center">
            <KaTeXFormula :formula="`C(${n2}, ${k2}) = ${val2.toLocaleString()}`" />
          </div>
        </div>
      </div>

      <div :class="[
        'rounded-xl p-4 text-center text-sm font-medium transition-colors',
        areEqual
          ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
          : 'bg-rose-950/30 border border-rose-500/30 text-rose-300',
      ]">
        <template v-if="areEqual">
          <span class="text-base">✓</span> Հավասար կոմբինատոր ծավալ
          <div class="text-[10px] mt-1 opacity-70">C({{ n1 }}, {{ k1 }}) = C({{ n2 }}, {{ k2 }}) = {{ val1.toLocaleString() }}</div>
        </template>
        <template v-else>
          <span class="text-base">✗</span> Տարբեր կոմբինատոր ծավալ
          <div class="text-[10px] mt-1 opacity-70">|{{ val1.toLocaleString() }} - {{ val2.toLocaleString() }}| = {{ Math.abs(val1 - val2).toLocaleString() }}</div>
        </template>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200">Հայտնի օրինակներ</h3>
      <div class="flex flex-wrap gap-2">
        <button @click="loadExample(16, 2, 10, 3)"
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/20">
          C(16, 2) = C(10, 3) = 120
        </button>
        <button @click="loadExample(21, 2, 10, 4)"
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/20">
          C(21, 2) = C(10, 4) = 210
        </button>
        <button @click="loadExample(10, 3, 16, 2)"
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/20">
          C(10, 3) = C(16, 2) = 120
        </button>
        <button @click="loadExample(10, 4, 21, 2)"
          class="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/20">
          C(10, 4) = C(21, 2) = 210
        </button>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200">Բացատրություն</h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Բինոմիալ հավասարումները ուսումնասիրում են այն դեպքերը, երբ տարբեր պարամետրերով բինոմիալ գործակիցները տալիս են նույն արժեքը.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula formula="C(n_1, k_1) = C(n_2, k_2)" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Մեր մոդելում յուրաքանչյուր համարժեքության դասի հզորությունը որոշվում է բինոմիալ գործակցով։ Հետևաբար, եթե երկու տարբեր դասեր ունեն նույն բինոմիալ արժեքը, ապա դրանք ունեն նույն կոմբինատոր ծավալը։
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        Սա թույլ է տալիս դիտարկել հավասարահզոր դասերի գաղափարը․ տարբեր չափողականության կամ տարբեր run-count ունեցող համակարգերը կարող են ունենալ նույն քանակի նախապատկերներ։
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> C(16, 2) = 120 և C(10, 3) = 120: Սա նշանակում է, որ n=16, k=2 ունեցող դասն ունի նույն չափը, ինչ n=10, k=3 ունեցող դասը։ Չնայած տարբեր չափողականություններին և տարբեր k-ին, երկու դասերն էլ պարունակում են 120-ական նախապատկերներ։
      </div>
    </div>
  </div>
</template>
