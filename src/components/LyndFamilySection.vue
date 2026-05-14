<script setup>
import { ref, computed } from 'vue'
import { binomial, binomialBigInt, adjacentCollisionBalance, isAdjacentCollision, getLyndExamples, formatBigInt } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const examples = getLyndExamples()
const selectedIdx = ref(0)

const ex = computed(() => examples[selectedIdx.value])

const binomVal1 = computed(() => binomialBigInt(ex.value.n, ex.value.k))
const binomVal2 = computed(() => binomialBigInt(ex.value.n - 1, ex.value.k + 1))
const balance = computed(() => adjacentCollisionBalance(ex.value.n, ex.value.k))

const binomFormat1 = computed(() => formatBigInt(binomVal1.value))
const binomFormat2 = computed(() => formatBigInt(binomVal2.value))

const fibNumbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765]

const showFactorial = ref(false)
const showFullTriangle = ref(true)

const testerN = ref(15)
const testerK = ref(5)

const tBinom1 = computed(() => binomialBigInt(testerN.value, testerK.value))
const tBinom2 = computed(() => binomialBigInt(testerN.value - 1, testerK.value + 1))
const tBalance = computed(() => adjacentCollisionBalance(testerN.value, testerK.value))
const tIsCollision = computed(() => isAdjacentCollision(testerN.value, testerK.value))
const tDiff = computed(() => {
  if (!tIsCollision.value) return Math.abs(Number(tBinom1.value - tBinom2.value))
  return 0
})

const tFormat1 = computed(() => formatBigInt(tBinom1.value))
const tFormat2 = computed(() => formatBigInt(tBinom2.value))

const pascalRows = computed(() => {
  const n = ex.value.n
  if (n > 30) return []
  const rows = []
  for (let r = 0; r <= n; r++) {
    const row = []
    for (let c = 0; c <= r; c++) {
      row.push({ n: r, k: c, value: binomial(r, c) })
    }
    rows.push(row)
  }
  return rows
})

function fibIndex(val) {
  return fibNumbers.indexOf(val)
}

function loadExample(idx) {
  selectedIdx.value = idx
}

function loadTester(n, k) {
  testerN.value = n
  testerK.value = k
}

function clampTesterN(v) {
  const val = parseInt(v.target.value) || 3
  testerN.value = Math.max(3, Math.min(5000, val))
}

function clampTesterK(v) {
  const val = parseInt(v.target.value) || 1
  testerK.value = Math.max(1, Math.min(testerN.value - 2, val))
}
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-5xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Լինդի անվերջ ընտանիք</h2>
      <p class="text-xs text-slate-500 mt-1">
        Fibonacci-based adjacent binomial collisions
      </p>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <p class="text-xs text-slate-400 leading-relaxed">
        Լինդի անվերջ ընտանիքը բինոմիալ բախումների հատուկ շարք է, որտեղ առաջանում են հարևան բախումներ.
      </p>
      <div class="text-center py-1">
        <KaTeXFormula formula="C(n, k) = C(n - 1, k + 1)" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Այս բախումները կապված են Ֆիբոնաչիի թվերի հետ և ցույց են տալիս, որ Պասկալի եռանկյան տարբեր դիրքերում կարող են հայտնվել նույն բինոմիալ արժեքները։
      </p>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Ֆիբոնաչիի ժամանակացույց</h3>
      <div class="overflow-x-auto -mx-1">
        <div class="flex gap-1.5 min-w-max px-1 py-2">
          <div v-for="(f, i) in fibNumbers" :key="i"
            :class="[
              'text-[10px] font-mono px-2 py-1 rounded border transition-all shrink-0',
              f === 5 || f === 13 || f === 89 || f === 610 || f === 4181
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-slate-800/40 border-transparent text-slate-500',
            ]">
            F<sub>{{ i + 1 }}</sub> = {{ f }}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-[10px] text-slate-500">Ընտրել օրինակը</span>
        <input type="range" v-model.number="selectedIdx" min="0" :max="examples.length - 1"
          class="w-32 sm:w-48 cursor-pointer" />
        <span class="text-[10px] font-mono text-amber-300">{{ ex.label }}</span>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Բախման զույգ</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-slate-800/40 rounded-xl p-4 text-center space-y-2 border border-blue-500/20">
          <div class="text-[11px] text-slate-400 font-medium">
            <KaTeXFormula :formula="`C(${ex.n}, ${ex.k})`" />
          </div>
          <div class="text-lg font-mono text-blue-300 font-bold">
            {{ binomFormat1.short || binomFormat1 }}
          </div>
          <div v-if="binomFormat1.full" class="text-[9px] text-slate-500">
            <button @click="binomFormat1.showFull = !binomFormat1.showFull"
              class="hover:text-slate-300 transition-colors">
              {{ binomFormat1.showFull ? binomFormat1.full : 'ցույց տալ ամբողջը' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="text-2xl font-bold" :class="balance.equal ? 'text-emerald-400' : 'text-rose-400'">
            {{ balance.equal ? '=' : '≠' }}
          </div>
        </div>

        <div class="bg-slate-800/40 rounded-xl p-4 text-center space-y-2 border border-emerald-500/20">
          <div class="text-[11px] text-slate-400 font-medium">
            <KaTeXFormula :formula="`C(${ex.n - 1}, ${ex.k + 1})`" />
          </div>
          <div class="text-lg font-mono text-emerald-300 font-bold">
            {{ binomFormat2.short || binomFormat2 }}
          </div>
          <div v-if="binomFormat2.full" class="text-[9px] text-slate-500">
            <button @click="binomFormat2.showFull = !binomFormat2.showFull"
              class="hover:text-slate-300 transition-colors">
              {{ binomFormat2.showFull ? binomFormat2.full : 'ցույց տալ ամբողջը' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="balance.equal" class="text-center text-xs text-emerald-400 bg-emerald-950/30 rounded-lg py-2">
        ✓ Հաստատված բախում՝ C({{ ex.n }}, {{ ex.k }}) = C({{ ex.n - 1 }}, {{ ex.k + 1 }})
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Հաշվեկշռի վիզուալ ապացույց</h3>

      <div class="relative py-8 px-4">
        <div class="flex items-end justify-center gap-8 sm:gap-16">
          <div class="text-center flex flex-col items-center gap-2">
            <div class="text-[10px] text-slate-400">n(k + 1)</div>
            <div class="text-lg font-mono font-bold" :class="balance.equal ? 'text-emerald-400' : 'text-blue-300'">
              {{ balance.left.toString() }}
            </div>
            <div class="text-[10px] text-slate-500">
              {{ ex.n }} × {{ ex.k + 1 }}
            </div>
          </div>

          <div class="flex flex-col items-center">
            <div class="text-[9px] text-slate-500 mb-1">⚖️</div>
            <div
              :class="[
                'w-24 sm:w-32 h-1.5 rounded-full transition-transform duration-500',
                balance.equal ? 'bg-emerald-400' : 'bg-amber-500',
              ]"
              :style="{ transform: balance.equal ? 'rotate(0deg)' : balance.left > balance.right ? 'rotate(-8deg)' : 'rotate(8deg)' }">
            </div>
            <div class="w-1 h-6 bg-slate-500 rounded-full"></div>
            <div class="text-[9px] text-slate-600 mt-1">հենակետ</div>
          </div>

          <div class="text-center flex flex-col items-center gap-2">
            <div class="text-[10px] text-slate-400">(n − k)(n − k − 1)</div>
            <div class="text-lg font-mono font-bold" :class="balance.equal ? 'text-emerald-400' : 'text-rose-300'">
              {{ balance.right.toString() }}
            </div>
            <div class="text-[10px] text-slate-500">
              {{ ex.n - ex.k }} × {{ ex.n - ex.k - 1 }}
            </div>
          </div>
        </div>

        <div v-if="balance.equal" class="text-center mt-4">
          <span class="inline-block text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 rounded-lg px-3 py-1.5">
            ✓ Բախումը հաստատված է
          </span>
        </div>
        <div v-else class="text-center mt-4 text-xs text-amber-400">
          Տարբերություն՝ {{ balance.diff.toString() }}
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Պասկալի եռանկյուն</h3>

      <div v-if="ex.n <= 30 && pascalRows.length > 0" class="space-y-3">
        <div class="flex items-center gap-2 text-[10px] text-slate-500">
          <span class="w-2.5 h-2.5 rounded bg-blue-500/40 border border-blue-400/60 inline-block"></span>
          C({{ ex.n }}, {{ ex.k }})
          <span class="w-2.5 h-2.5 rounded bg-emerald-500/40 border border-emerald-400/60 inline-block"></span>
          C({{ ex.n - 1 }}, {{ ex.k + 1 }})
        </div>

        <div class="overflow-x-auto py-1 -mx-1">
          <div class="flex flex-col items-center gap-0.5 min-w-max px-2">
            <div v-for="(row, r) in pascalRows" :key="r" class="flex justify-center gap-0.5">
              <div
                v-for="(cell, c) in row" :key="c"
                :title="`C(${cell.n},${cell.k}) = ${cell.value.toLocaleString()}`"
                :class="[
                  'w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[7px] sm:text-[8px] font-mono rounded transition-colors',
                  cell.n === ex.n && cell.k === ex.k
                    ? 'text-white bg-blue-500/50 border border-blue-400/70 shadow-lg shadow-blue-500/30 scale-110 z-10'
                    : cell.n === ex.n - 1 && cell.k === ex.k + 1
                      ? 'text-white bg-emerald-500/50 border border-emerald-400/70 shadow-lg shadow-emerald-500/30 scale-110 z-10'
                      : c === 0 || c === r
                        ? 'text-slate-600 bg-slate-800/20'
                        : 'text-slate-500 bg-slate-800/40',
                ]">
                {{ cell.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-slate-800/40 rounded-xl p-4 space-y-2 text-center">
        <div class="text-[10px] text-slate-500">Սեղմված տեսք (n = {{ ex.n }} ≥ 30)</div>
        <div class="flex items-center justify-center gap-6 py-3">
          <div class="text-center">
            <div class="text-[10px] text-slate-400 mb-1">C({{ ex.n }}, {{ ex.k }})</div>
            <div class="inline-block px-3 py-1.5 bg-blue-500/30 border border-blue-400/50 rounded text-xs font-mono text-blue-200">
              {{ binomFormat1.short || binomFormat1 }}
            </div>
          </div>
          <div class="text-lg text-slate-500">=</div>
          <div class="text-center">
            <div class="text-[10px] text-slate-400 mb-1">C({{ ex.n - 1 }}, {{ ex.k + 1 }})</div>
            <div class="inline-block px-3 py-1.5 bg-emerald-500/30 border border-emerald-400/50 rounded text-xs font-mono text-emerald-200">
              {{ binomFormat2.short || binomFormat2 }}
            </div>
          </div>
        </div>
        <div class="text-[10px] text-slate-600">
          Վերին տողերը սեղմված են. ցուցադրված են միայն բախվող դիրքերը
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200">Ֆակտորիալային արտածում</h3>
      <button @click="showFactorial = !showFactorial"
        class="text-[10px] px-3 py-1 rounded-lg bg-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors">
        {{ showFactorial ? 'Թաքցնել արտածումը' : 'Ցույց տալ արտածումը' }}
      </button>

      <div v-if="showFactorial" class="space-y-3 text-xs text-slate-400">
        <p>Բինոմիալ գործակիցների ֆակտորիալային ներկայացումից՝</p>
        <div class="bg-slate-900/50 rounded-lg p-3 text-center space-y-2">
          <KaTeXFormula :formula="`C(${ex.n}, ${ex.k}) = \\frac{${ex.n}!}{${ex.k}!(${ex.n} - ${ex.k})!}`" :displayMode="true" />
          <KaTeXFormula :formula="`C(${ex.n - 1}, ${ex.k + 1}) = \\frac{${ex.n - 1}!}{(${ex.k + 1})!(${ex.n} - ${ex.k} - 2)!}`" :displayMode="true" />
        </div>
        <p>Հարաբերությունը՝</p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`\\frac{C(${ex.n}, ${ex.k})}{C(${ex.n - 1}, ${ex.k + 1})} = \\frac{${ex.n}(${ex.k} + 1)}{(${ex.n} - ${ex.k})(${ex.n} - ${ex.k} - 1)}`" :displayMode="true" />
        </div>
        <p>Բախման պայմանը՝</p>
        <div class="text-center py-1">
          <KaTeXFormula
            :formula="`\\frac{C(n, k)}{C(n - 1, k + 1)} = 1 \\iff n(k + 1) = (n - k)(n - k - 1)`"
            :displayMode="true" />
        </div>
        <div v-if="balance.equal" class="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-2 text-center text-emerald-300">
          ✓ {{ ex.n }} · {{ ex.k + 1 }} = {{ ex.n - ex.k }} · {{ ex.n - ex.k - 1 }} = {{ balance.left.toString() }}
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200">Ինտերակտիվ ստուգիչ</h3>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500">n</span>
          <input type="number" :value="testerN" @input="clampTesterN" min="3" max="5000"
            class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500">k</span>
          <input type="number" :value="testerK" @input="clampTesterK" min="1"
            class="w-16 bg-slate-800/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button v-for="(exItem, i) in examples" :key="i"
          @click="loadTester(exItem.n, exItem.k)"
          :class="[
            'text-[10px] px-2 py-1 rounded-lg font-mono transition-colors border',
            testerN === exItem.n && testerK === exItem.k
              ? 'bg-blue-500/30 text-blue-200 border-blue-500/40'
              : 'bg-slate-700/30 text-slate-400 border-transparent hover:border-slate-500/50',
          ]">
          {{ exItem.label }}: C({{ exItem.n }},{{ exItem.k }})
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="bg-slate-800/40 rounded-lg p-3 space-y-1">
          <div class="text-[10px] text-slate-500">C({{ testerN }}, {{ testerK }})</div>
          <div class="text-sm font-mono text-blue-300">{{ tFormat1.short || tFormat1 }}</div>
        </div>
        <div class="bg-slate-800/40 rounded-lg p-3 space-y-1">
          <div class="text-[10px] text-slate-500">C({{ testerN - 1 }}, {{ testerK + 1 }})</div>
          <div class="text-sm font-mono text-emerald-300">{{ tFormat2.short || tFormat2 }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="bg-slate-800/40 rounded-lg p-2 text-center text-[11px]">
          <span class="text-slate-500">Ձախ՝ </span>
          <span class="font-mono" :class="tBalance.equal ? 'text-emerald-300' : 'text-slate-300'">
            n(k+1) = {{ tBalance.left.toString() }}
          </span>
        </div>
        <div class="bg-slate-800/40 rounded-lg p-2 text-center text-[11px]">
          <span class="text-slate-500">Աջ՝ </span>
          <span class="font-mono" :class="tBalance.equal ? 'text-emerald-300' : 'text-slate-300'">
            (n-k)(n-k-1) = {{ tBalance.right.toString() }}
          </span>
        </div>
      </div>

      <div class="text-center text-xs" :class="tIsCollision ? 'text-emerald-400' : 'text-rose-400'">
        <template v-if="tIsCollision">
          ✓ Հարևան բախում. C({{ testerN }}, {{ testerK }}) = C({{ testerN - 1 }}, {{ testerK + 1 }})
        </template>
        <template v-else>
          ✗ Հարևան բախում չէ. տարբերությունը {{ tDiff }}
        </template>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200">Կապը թեզիսի մոդելի հետ</h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Մեր աշխատանքում յուրաքանչյուր համարժեքության դասի հզորությունը արտահայտվում է բինոմիալ գործակցով։ Լինդի ընտանիքը ցույց է տալիս, որ տարբեր պարամետրերով առաջացող դասեր կարող են ունենալ նույն հզորությունը։
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        Այսինքն՝ տարբեր չափողականություններում կամ տարբեր run-count արժեքների դեպքում կարող են առաջանալ հավասարահզոր դասեր։ Սա բացատրում է, թե ինչու բինոմիալ բախումները կարևոր են համակարգի կոմբինատոր կառուցվածքը հասկանալու համար։
      </p>
    </div>
  </div>
</template>
