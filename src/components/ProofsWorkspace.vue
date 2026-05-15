<script setup>
import { inject, ref, computed } from 'vue'
import KaTeXFormula from './KaTeXFormula.vue'
import PascalTriangleProof from './PascalTriangleProof.vue'
import { binomialBigInt, adjacentCollisionBalance, fibonacciBigInt, formatBigInt } from '../utils/cubeMath.js'

const appState = inject('appState')

const lyndI = ref(1)
const collapsed8 = ref(false)
const collapsed9 = ref(false)
const collapsed10 = ref(false)
const collapsed11 = ref(false)

const fib2i = computed(() => fibonacciBigInt(2 * lyndI.value))
const fib2i1 = computed(() => fibonacciBigInt(2 * lyndI.value + 1))
const fib2i2 = computed(() => fibonacciBigInt(2 * lyndI.value + 2))
const fib2i3 = computed(() => fibonacciBigInt(2 * lyndI.value + 3))

const lyndN = computed(() => fib2i2.value * fib2i3.value)
const lyndK = computed(() => fib2i.value * fib2i3.value)
const lyndNMinusK = computed(() => fib2i1.value * fib2i3.value)
const lyndBalance = computed(() => adjacentCollisionBalance(Number(lyndN.value), Number(lyndK.value)))
const lyndCollision = computed(() => lyndBalance.value.equal)
const lyndBinom1 = computed(() => binomialBigInt(Number(lyndN.value), Number(lyndK.value)))
const lyndBinom2 = computed(() => binomialBigInt(Number(lyndN.value) - 1, Number(lyndK.value) + 1))

const lyndExamples = [
  { i: 1, n: 15, k: 5, val: 3003 },
  { i: 2, n: 104, k: 39, val: '≈ 6.12×10^28' },
  { i: 3, n: 714, k: 272, val: '≈ 2.14×10^153' },
  { i: 4, n: 4895, k: 1869, val: '≈ 1.65×10^7' },
]
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Թեորեմներ և Ապացույցներ</h2>
      <p class="text-xs text-slate-500 mt-1">
        Միատարր հատվածների երկարության կրճատման համարժեքության կառուցվածքի հիմքում ընկած ֆորմալ արդյունքները:
      </p>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-blue-500/20 text-blue-300 text-[10px] flex items-center justify-center font-mono">1</span>
        Համարժեքության հարաբերություն
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Սահմանենք ~ հարաբերությունը <span class="font-mono text-slate-300">Σⁿ</span> բազմության վրա հետևյալ կերպ՝
        <span class="font-mono text-slate-200">x ~ z</span> այն և միայն այն դեպքում, երբ
        <span class="font-mono text-emerald-300">g(x) = g(z)</span>:
        Այդ դեպքում ~-ը համարժեքության հարաբերություն է:
      </p>
      <ul class="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
        <li><strong class="text-slate-300">Ռեֆլեքսիվություն:</strong> g(x) = g(x) բոլոր x-երի համար, հետևաբար x ~ x:</li>
        <li><strong class="text-slate-300">Սիմետրիկություն:</strong> Եթե x ~ z, ապա g(x) = g(z) → g(z) = g(x) → z ~ x:</li>
        <li><strong class="text-slate-300">Տրանզիտիվություն:</strong> Եթե x ~ z և z ~ w, ապա g(x) = g(z) = g(w) → x ~ w:</li>
      </ul>
      <p class="text-xs text-slate-400 leading-relaxed">
        Հետևաբար, ~ հարաբերությունը տրոհում է <span class="font-mono text-slate-300">Σⁿ</span>-ը չհատվող համարժեքության դասերի, որոնք նույնականացվում են հերթագայող կրճատված y տողերով: Յուրաքանչյուր H(y, n) = {x ∈ Σⁿ : g(x) = y} դաս դատարկ չէ ցանկացած 1 ≤ k ≤ n երկարություն ունեցող հերթագայող y տողի համար:
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> n = 4: y = 10-ի համարժեքության դասը պարունակում է {1000, 1100, 1110} տողերը: g(1000) = 10, g(1100) = 10, g(1110) = 10:
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center justify-center font-mono">2</span>
        Նախապատկերների քանակը
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Դիցուք y-ը k երկարությամբ հերթագայող երկուական տող է: Այն x ∈ Σⁿ տողերի քանակը, որոնց համար g(x) = y, հավասար է՝
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`|g^{-1}(y) \\cap \\Sigma^n| = C(n - 1, k - 1)`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Ապացույց:</strong> x նախապատկերը միարժեքորեն որոշվում է իր l₁, …, lₖ միատարր հատվածների երկարություններով, որտեղ lᵢ ≥ 1 և Σ lᵢ = n: Այս հավասարման դրական ամբողջ լուծումների քանակը հավասար է C(n – 1, k – 1), որն իրենից ներկայացնում է n թվի տրոհումը k մասերի: Յուրաքանչյուր տրոհում համապատասխանում է y տողի ընդլայնմանը՝ կրկնելով նրա i-րդ բիթը lᵢ անգամ:
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> n = 5, y = 101 (k = 3): C(4, 2) = 6 նախապատկերներ՝ 10111, 10011, 10001, 11011, 11001, 11101: Յուրաքանչյուրի համար g(x) = 101:
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-mono">3</span>
        «Աստղերի և ձողերի» մեթոդ
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        «Աստղերի և ձողերի» (Stars-and-bars) մեթոդը տալիս է նախապատկերների քանակի ուղղակի կոմբինատոր ապացույցը.
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        Տեղադրենք <span class="font-mono text-slate-200">n</span> քանակությամբ չտարբերակվող միավորներ (աստղեր) մի շարքով: Հարևան միավորների միջև կա <span class="font-mono text-slate-200">n – 1</span> արանք: Ընտրենք <span class="font-mono text-slate-200">k – 1</span> արանքներ՝ բաժանիչներ (ձողեր) տեղադրելու համար: Սա աստղերը բաժանում է <span class="font-mono text-slate-200">k</span> խմբերի, որոնցից յուրաքանչյուրը պարունակում է առնվազն մեկ աստղ, ինչը համապատասխանում է l₁, …, lₖ միատարր հատվածների երկարություններին:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\#\\text{ընտրություններ} = C(n - 1, k - 1)`" :displayMode="true" />
      </div>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400 text-center font-mono text-lg leading-relaxed">
        ★ ★ <span class="text-blue-400">│</span> ★ ★ ★ <span class="text-blue-400">│</span> ★ ★
        <div class="text-[10px] text-slate-500 mt-1">n = 7, k = 3, կազմություն [2, 3, 2]</div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-purple-500/20 text-purple-300 text-[10px] flex items-center justify-center font-mono">4</span>
        Արտածում մայր ֆունկցիաների միջոցով
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Յուրաքանչյուր միատարր հատվածի երկարություն նպաստում է դրական ամբողջ թվերի համար նախատեսված մայր ֆունկցիային.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`x + x^2 + x^3 + \\cdots = \\frac{x}{1 - x}`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        k հատվածների համար n-ի տրոհումների մայր ֆունկցիան k մասերի հետևյալն է.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\Phi(x) = \\left(\\frac{x}{1 - x}\\right)^k = x^k \\cdot (1 - x)^{-k}`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Ընդլայնելով բացասական բինոմիալ շարքի միջոցով.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula
          :formula="`(1 - x)^{-k} = \\sum_{m=0}^\\infty C(m + k - 1, k - 1) x^m`"
          :displayMode="true"
        />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        xᵏ-ով բազմապատկելը տեղաշարժում է ինդեքսը՝ տալով xⁿ-ի գործակիցը որպես C(n – 1, k – 1):
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> k = 3: Φ(x) = x³/(1 – x)³: x⁵-ի գործակիցը C(4,2) = 6 է:
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-rose-500/20 text-rose-300 text-[10px] flex items-center justify-center font-mono">5</span>
        Հոկեյի մականի նույնականություն
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Ֆիքսված k երկարությամբ հերթագայող y տողի համար նախապատկերների կումուլյատիվ քանակը բոլոր m = k, k+1, …, n չափողականությունների համար բավարարում է հետևյալին.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\sum_{m=k}^n C(m - 1, k - 1) = C(n, k)`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Ապացույց:</strong> Ըստ հոկեյի մականի նույնականության (Պասկալի կանոնի բազմակի կիրառմամբ)՝ C(k–1, k–1) + C(k, k–1) + … + C(n–1, k–1) = C(n, k):
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        Սա հաշվում է k-ից n երկարություն ունեցող բոլոր տողերը, որոնք կրճատվում են մինչև y, ինչը առանցքային քայլ է չափողականության հետ դասերի չափերի աճի վերլուծության մեջ:
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> y = 101 (k = 3), n = 5: C(2,2) + C(3,2) + C(4,2) = 1 + 3 + 6 = 10 = C(5,3):
      </div>
      <PascalTriangleProof />
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">6</span>
        Տրոհման լրիվությունը
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        H(y, n) համարժեքության դասերը ճշգրիտ կերպով տրոհում են <span class="font-mono text-slate-300">Σⁿ</span> բազմությունը: Յուրաքանչյուր n չափողականության համար.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula
          :formula="`\\sum_{k=1}^n 2 \\cdot C(n - 1, k - 1) = 2^n`"
          :displayMode="true"
        />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Ապացույց:</strong> Յուրաքանչյուր k-ի համար (1 ≤ k ≤ n) գոյություն ունի ճիշտ 2 հատ k երկարությամբ հերթագայող երկուական տող՝ մեկը սկսվող 0-ով, մյուսը՝ 1-ով: Յուրաքանչյուր նման y ունի C(n – 1, k – 1) չափի դաս: Գումարելով.
      </p>
      <div class="text-center py-1">
        <KaTeXFormula :formula="`\\sum_{k=1}^n 2 \\cdot C(n - 1, k - 1) = 2 \\cdot 2^{n-1} = 2^n = |\\Sigma^n|`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Քանի որ դասերը չհատվող են (դրանք համարժեքության դասեր են) և դրանց չափերի գումարը հավասար է <span class="font-mono text-slate-300">Σⁿ</span> բազմության հզորությանը, յուրաքանչյուր երկուական տող պատկանում է ճիշտ մեկ դասի:
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> n = 4: k=1՝ 2×1=2, k=2՝ 2×3=6, k=3՝ 2×3=6, k=4՝ 2×1=2: Ընդամենը = 16 = 2⁴: n = {{ appState.workspaceDimension }}-ի համար «Բաշխում» ներդիրը հաստատում է այս նույնականությունը:
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-orange-500/20 text-orange-300 text-[10px] flex items-center justify-center font-mono">7</span>
        Միատարր հատվածների քանակի ասիմպտոտիկ վարքը
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Հավասարաչափ պատահական x ∈ Σⁿ երկուական տողի համար (մետաղադրամի անկախ նետումներ), K = runCount(x) քանակն ունի.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\mathbb{E}[K] = \\frac{n + 1}{2},\\qquad \\mathrm{Var}(K) = \\frac{n - 1}{4}`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Արտածում:</strong> Ներկայացնենք K = 1 + Σ_{i=2}^{n} I(bᵢ ≠ b_{i-1}): Յուրաքանչյուր ինդիկատոր Բեռնուլիի (1/2) պատահական մեծություն է, և հարևան ինդիկատորները անկախ են: Բիթերի փոփոխության սպասվող քանակը (n – 1)/2 է, հետևաբար E[K] = 1 + (n – 1)/2 = (n + 1)/2: Դիսպերսիան բխում է անկախությունից:
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Հետևություն:</strong> Մեծ n-երի համար K-ն կենտրոնանում է n/2-ի շուրջ: Տիպիկ պատահական տողն ունի k/n ≈ 50% սեղմման գործակից, ինչը տալիս է RLE-ի նվազագույն խնայողություն: RLE-ն առավել արդյունավետ է կառուցվածքային տողերի համար (փոքր k), որոնք հանդիպում են պատկերներում կամ գենոմային տվյալներում:
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Օրինակ՝</strong> n = 100, E[K] = 50.5: k = 3 ունեցող տողը (97% խնայողություն) պահանջում է խիստ կառուցվածքային մուտքային տվյալներ, ինչը էքսպոնենցիալ քիչ հավանական է պատահականության դեպքում: «Սիմուլյացիա» ներդիրը սա ցուցադրում է փորձնականորեն:
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-teal-500/20 text-teal-300 text-[10px] flex items-center justify-center font-mono">8</span>
        Լինդի անվերջ ընտանիք
        <span class="text-[9px] text-teal-400/60 font-normal">Ֆիբոնաչիի թվերով ստացվող հարևան բինոմիալ բախումներ</span>
      </h3>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-teal-300 font-medium">Պնդում</div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Լինդի ընտանիքը տրվում է հետևյալ բանաձևով.
        </p>
        <div class="text-center py-2">
          <KaTeXFormula :formula="`C(F_{2i+2}F_{2i+3}, F_{2i}F_{2i+3}) = C(F_{2i+2}F_{2i+3} - 1, F_{2i}F_{2i+3} + 1)`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed text-center">
          որտեղ i = 1, 2, 3, … և <span class="font-mono text-slate-300">F_m</span>-ը Ֆիբոնաչիի m-րդ թիվն է։
        </p>
      </div>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-teal-300 font-medium">Օրինակներ</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div v-for="ex in lyndExamples" :key="ex.i" class="bg-slate-900/40 rounded-lg p-2.5 space-y-1">
            <div class="font-mono text-teal-300">i = {{ ex.i }}</div>
            <div class="text-slate-400">
              <KaTeXFormula :formula="`C(${ex.n}, ${ex.k}) = C(${ex.n - 1}, ${ex.k + 1})`" />
            </div>
            <div class="text-emerald-400 font-mono text-[11px]">
              = {{ ex.val }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-3">
        <div class="flex items-center gap-2">
          <span class="text-[10px] text-teal-300 font-medium">Ինտերակտիվ ցուցադրություն</span>
          <span class="text-[9px] text-slate-500">i = {{ lyndI }}</span>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] text-slate-500 flex justify-between">
            <span>Ընտրել i-ն</span>
            <span class="font-mono text-slate-400">{{ lyndI }}</span>
          </label>
          <input type="range" v-model.number="lyndI" min="1" max="8" step="1"
            class="w-full cursor-pointer accent-teal-500" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">F<sub>{{ 2*lyndI }}</sub></div>
            <div class="text-[10px] font-mono text-slate-300 truncate" :title="fib2i.toString()">{{ fib2i.toString() }}</div>
          </div>
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">F<sub>{{ 2*lyndI + 1 }}</sub></div>
            <div class="text-[10px] font-mono text-slate-300 truncate" :title="fib2i1.toString()">{{ fib2i1.toString() }}</div>
          </div>
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">F<sub>{{ 2*lyndI + 2 }}</sub></div>
            <div class="text-[10px] font-mono text-slate-300 truncate" :title="fib2i2.toString()">{{ fib2i2.toString() }}</div>
          </div>
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">F<sub>{{ 2*lyndI + 3 }}</sub></div>
            <div class="text-[10px] font-mono text-slate-300 truncate" :title="fib2i3.toString()">{{ fib2i3.toString() }}</div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">n = F<sub>{{2*lyndI+2}}</sub>F<sub>{{2*lyndI+3}}</sub></div>
            <div class="text-xs font-mono text-blue-300 truncate" :title="lyndN.toString()">{{ lyndN.toString() }}</div>
          </div>
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">k = F<sub>{{2*lyndI}}</sub>F<sub>{{2*lyndI+3}}</sub></div>
            <div class="text-xs font-mono text-amber-300 truncate" :title="lyndK.toString()">{{ lyndK.toString() }}</div>
          </div>
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">n−k = F<sub>{{2*lyndI+1}}</sub>F<sub>{{2*lyndI+3}}</sub></div>
            <div class="text-xs font-mono text-purple-300 truncate" :title="lyndNMinusK.toString()">{{ lyndNMinusK.toString() }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">Ձախ՝ n(k+1)</div>
            <div class="text-xs font-mono" :class="lyndCollision ? 'text-emerald-300' : 'text-slate-300'">{{ lyndBalance.left.toString() }}</div>
          </div>
          <div class="bg-slate-900/50 rounded p-2 text-center">
            <div class="text-[9px] text-slate-500">Աջ՝ (n−k)(n−k−1)</div>
            <div class="text-xs font-mono" :class="lyndCollision ? 'text-emerald-300' : 'text-slate-300'">{{ lyndBalance.right.toString() }}</div>
          </div>
        </div>

        <div v-if="lyndCollision" class="bg-emerald-950/30 border border-emerald-500/30 rounded-lg py-2 text-center">
          <span class="text-xs text-emerald-400 font-medium">
            ✓ Բախումը հաստատված է
          </span>
          <div class="text-[10px] text-emerald-400/60 mt-0.5">
            <KaTeXFormula :formula="`C(${lyndN}, ${lyndK}) = C(${lyndN - 1n}, ${lyndK + 1n})`" />
          </div>
        </div>
        <div v-else class="bg-amber-950/30 border border-amber-500/30 rounded-lg py-2 text-center">
          <span class="text-xs text-amber-400">n(k+1) ≠ (n−k)(n−k−1)</span>
        </div>
      </div>

      <div>
        <button @click="collapsed8 = !collapsed8"
          class="text-[10px] px-3 py-1 rounded-lg bg-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors">
          {{ collapsed8 ? 'Ցույց տալ բացատրությունը' : 'Թաքցնել բացատրությունը' }}
        </button>
      </div>

      <div v-if="!collapsed8" class="space-y-2">
        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-teal-300 font-medium">Բացատրություն</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Լինդի ընտանիքի կարևորությունը այն է, որ այն ցույց է տալիս՝ բինոմիալ բախումները միայն պատահական կամ մեկուսացված օրինակներ չեն։ Գոյություն ունի ամբողջ անվերջ ընտանիք, որտեղ տարբեր բինոմիալ գործակիցներ ունեն նույն արժեքը։
          </p>
          <p class="text-xs text-slate-400 leading-relaxed">
            Մեր աշխատանքի տեսանկյունից սա նշանակում է, որ տարբեր պարամետրերով առաջացող համարժեքության դասեր կարող են ունենալ նույն կոմբինատոր հզորությունը։
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] flex items-center justify-center font-mono">9</span>
        Հարևան բախման պայմանը
        <span class="text-[9px] text-indigo-400/60 font-normal">Երբ է C(n,k)-ն հավասար C(n−1,k+1)-ին</span>
      </h3>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-indigo-300 font-medium">Պնդում</div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Հարևան բինոմիալ բախումը ունի հետևյալ տեսքը.
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`C(n,k) = C(n-1,k+1)`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Պետք է գտնենք, թե ինչ պայմանով է այս հավասարությունը ճիշտ։
        </p>
      </div>

      <div>
        <button @click="collapsed9 = !collapsed9"
          class="text-[10px] px-3 py-1 rounded-lg bg-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors">
          {{ collapsed9 ? 'Ցույց տալ ապացույցը' : 'Թաքցնել ապացույցը' }}
        </button>
      </div>

      <div v-if="!collapsed9" class="space-y-3">
        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-indigo-300 font-medium">Ապացույց</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Սկսենք հարաբերությունից.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`C(n,k) / C(n-1,k+1)`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Օգտագործենք բինոմիալ գործակցի բանաձևը.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`C(n,k) = \\frac{n!}{k!(n-k)!}`" :displayMode="true" />
          </div>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`C(n-1,k+1) = \\frac{(n-1)!}{(k+1)!(n-k-2)!}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ուստի.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`\\frac{C(n,k)}{C(n-1,k+1)} = \\frac{n(k+1)}{(n-k)(n-k-1)}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Հետևաբար.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`C(n,k) = C(n-1,k+1) \\iff n(k+1) = (n-k)(n-k-1)`" :displayMode="true" />
          </div>
        </div>

        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-indigo-300 font-medium">Օրինակ՝ n = 15, k = 5</div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="bg-slate-900/50 rounded p-2 text-center">
              <div class="text-slate-500 mb-1">Ձախ՝ n(k+1)</div>
              <div class="font-mono text-emerald-300">15 · 6 = 90</div>
            </div>
            <div class="bg-slate-900/50 rounded p-2 text-center">
              <div class="text-slate-500 mb-1">Աջ՝ (n−k)(n−k−1)</div>
              <div class="font-mono text-emerald-300">10 · 9 = 90</div>
            </div>
          </div>
          <div class="bg-emerald-950/30 border border-emerald-500/30 rounded-lg py-2 text-center">
            <span class="text-xs text-emerald-400">✓ n(k+1) = (n−k)(n−k−1) → Բախումը հաստատված է</span>
          </div>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`C(15,5) = C(14,6) = 3003`" :displayMode="true" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-violet-500/20 text-violet-300 text-[10px] flex items-center justify-center font-mono">10</span>
        Լինդի ընտանիքի ապացույցը
        <span class="text-[9px] text-violet-400/60 font-normal">Ինչու է Ֆիբոնաչիի ընտրությունը աշխատում</span>
      </h3>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-violet-300 font-medium">Պնդում</div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Դնենք՝
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`n = F_{2i+2}F_{2i+3}`" :displayMode="true" />
        </div>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`k = F_{2i}F_{2i+3}`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Պետք է ապացուցենք, որ
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`C(n,k) = C(n-1,k+1)`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Այսինքն, ըստ նախորդ պնդման, բավական է ապացուցել՝
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`n(k+1) = (n-k)(n-k-1)`" :displayMode="true" />
        </div>
      </div>

      <div>
        <button @click="collapsed10 = !collapsed10"
          class="text-[10px] px-3 py-1 rounded-lg bg-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors">
          {{ collapsed10 ? 'Ցույց տալ մանրամասն ապացույցը' : 'Թաքցնել մանրամասն ապացույցը' }}
        </button>
      </div>

      <div v-if="!collapsed10" class="space-y-3">
        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-violet-300 font-medium">Ապացույց</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Նախ հաշվենք n − k-ն.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`n - k = F_{2i+2}F_{2i+3} - F_{2i}F_{2i+3}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ընդհանուր արտադրիչը հանենք փակագծից.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`n - k = (F_{2i+2} - F_{2i})F_{2i+3}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Քանի որ Ֆիբոնաչիի հաջորդականության համար՝
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+2} = F_{2i+1} + F_{2i}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            ապա.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`n - k = F_{2i+1}F_{2i+3}`" :displayMode="true" />
          </div>
        </div>

        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <p class="text-xs text-slate-400 leading-relaxed">
            Այժմ հարևան բախման պայմանը դառնում է.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`n(k+1) = (n-k)(n-k-1)`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Փոխարինենք n-ը, k-ն և n−k-ն.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+2}F_{2i+3}(F_{2i}F_{2i+3}+1) = F_{2i+1}F_{2i+3}(F_{2i+1}F_{2i+3}-1)`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Քանի որ երկու կողմերում կա F<sub>2i+3</sub> արտադրիչ, կրճատում ենք.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+2}(F_{2i}F_{2i+3}+1) = F_{2i+1}(F_{2i+1}F_{2i+3}-1)`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Բացենք փակագծերը.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i}F_{2i+2}F_{2i+3} + F_{2i+2} = F_{2i+1}^2F_{2i+3} - F_{2i+1}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Տեղափոխենք անդամները.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+3}(F_{2i+1}^2 - F_{2i}F_{2i+2}) = F_{2i+1} + F_{2i+2}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Բայց Ֆիբոնաչիի ռեկուրենտ բանաձևից.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+1} + F_{2i+2} = F_{2i+3}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ուստի բավական է ապացուցել, որ
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+1}^2 - F_{2i}F_{2i+2} = 1`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Սա հենց Կասինիի նույնականությունն է զույգ ինդեքսի դեպքում։
          </p>
        </div>

        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-emerald-300 font-medium">Եզրակացություն</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Քանի որ Կասինիի նույնականությունը ասում է՝
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{r+1}^2 - F_rF_{r+2} = (-1)^r`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            ապա r = 2i դեպքում.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{2i+1}^2 - F_{2i}F_{2i+2} = (-1)^{2i} = 1`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ուրեմն n(k+1) = (n−k)(n−k−1) և հետևաբար.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`C(n,k) = C(n-1,k+1)`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Այսպիսով ապացուցվում է, որ Լինդի ընտանիքի յուրաքանչյուր անդամ իսկապես հարևան բինոմիալ բախում է։
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-fuchsia-500/20 text-fuchsia-300 text-[10px] flex items-center justify-center font-mono">11</span>
        Կասինիի նույնականություն
        <span class="text-[9px] text-fuchsia-400/60 font-normal">Ֆիբոնաչիի թվերի հիմնական նույնականություն</span>
      </h3>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-fuchsia-300 font-medium">Պնդում</div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Կասինիի նույնականությունը պնդում է, որ ցանկացած r ≥ 0 համար՝
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`F_{r+1}^2 - F_rF_{r+2} = (-1)^r`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Այն նշանակում է, որ արտահայտությունը
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`F_{r+1}^2 - F_rF_{r+2}`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          հերթով ընդունում է 1 և −1 արժեքները։
          Եթե r-ը զույգ է, արժեքը 1 է։ Եթե r-ը կենտ է, արժեքը −1 է։
        </p>
      </div>

      <div>
        <button @click="collapsed11 = !collapsed11"
          class="text-[10px] px-3 py-1 rounded-lg bg-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors">
          {{ collapsed11 ? 'Ցույց տալ ինդուկցիոն ապացույցը' : 'Թաքցնել ինդուկցիոն ապացույցը' }}
        </button>
      </div>

      <div v-if="!collapsed11" class="space-y-3">
        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-fuchsia-300 font-medium">Ապացույց ինդուկցիայով</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Սահմանենք՝
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_r = F_{r+1}^2 - F_rF_{r+2}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Պետք է ապացուցենք, որ A<sub>r</sub> = (−1)<sup>r</sup>։
          </p>
        </div>

        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-amber-300 font-medium">Հիմք (Base case)</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            r = 0 դեպքում.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_0 = F_1^2 - F_0F_2`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Քանի որ F₀ = 0, F₁ = 1, F₂ = 1, ստանում ենք.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_0 = 1^2 - 0 \\cdot 1 = 1`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Իսկ (−1)⁰ = 1: Ուստի պնդումը ճիշտ է r = 0 դեպքում։
          </p>
        </div>

        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-amber-300 font-medium">Ինդուկցիոն քայլ (Induction step)</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ենթադրենք, որ ինչ-որ r-ի համար ճիշտ է.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_r = F_{r+1}^2 - F_rF_{r+2} = (-1)^r`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Պետք է ապացուցել A<sub>r+1</sub> = (−1)<sup>r+1</sup>:
          </p>
          <p class="text-xs text-slate-400 leading-relaxed">
            Հաշվենք A<sub>r+1</sub>-ը.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = F_{r+2}^2 - F_{r+1}F_{r+3}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ֆիբոնաչիի բանաձևով F<sub>r+3</sub> = F<sub>r+2</sub> + F<sub>r+1</sub>, ուստի.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = F_{r+2}^2 - F_{r+1}(F_{r+2}+F_{r+1})`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Բացենք փակագծերը.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = F_{r+2}^2 - F_{r+1}F_{r+2} - F_{r+1}^2`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Առաջին երկու անդամները խմբավորենք.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = F_{r+2}(F_{r+2} - F_{r+1}) - F_{r+1}^2`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Քանի որ F<sub>r+2</sub> = F<sub>r+1</sub> + F<sub>r</sub>, ապա F<sub>r+2</sub> − F<sub>r+1</sub> = F<sub>r</sub>:
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = F_{r+2}F_r - F_{r+1}^2`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Այսինքն.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = -(F_{r+1}^2 - F_rF_{r+2}) = -A_r`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Ըստ ինդուկցիոն ենթադրության A<sub>r</sub> = (−1)<sup>r</sup>, ուրեմն.
          </p>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`A_{r+1} = -(-1)^r = (-1)^{r+1}`" :displayMode="true" />
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            Այսպիսով պնդումն ապացուցված է բոլոր r ≥ 0 համար։
          </p>
        </div>

        <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
          <div class="text-[10px] text-emerald-300 font-medium">Եզրակացություն</div>
          <div class="text-center py-1">
            <KaTeXFormula :formula="`F_{r+1}^2 - F_rF_{r+2} = (-1)^r`" :displayMode="true" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-yellow-500/20 text-yellow-300 text-[10px] flex items-center justify-center font-mono">12</span>
        Կասինիից դեպի Լինդի ընտանիք
        <span class="text-[9px] text-yellow-400/60 font-normal">Ինչու է Կասինիի +1-ը ստեղծում բախումը</span>
      </h3>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <p class="text-xs text-slate-400 leading-relaxed">
          Լինդի ընտանիքի ապացույցում անհրաժեշտ էր ստանալ.
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`F_{2i+1}^2 - F_{2i}F_{2i+2} = 1`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Կասինիի նույնականության մեջ վերցնում ենք r = 2i:
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`F_{(2i)+1}^2 - F_{2i}F_{2i+2} = (-1)^{2i}`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Քանի որ 2i-ն զույգ թիվ է, ունենք.
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`(-1)^{2i} = 1`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Հետևաբար.
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`F_{2i+1}^2 - F_{2i}F_{2i+2} = 1`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Այս +1-ը հենց այն փոքր, բայց կարևոր տարբերությունն է, որը հավասարակշռում է հարևան բինոմիալ գործակիցների հարաբերությունը։
        </p>
      </div>

      <div class="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-emerald-300 font-medium">Եզրափակիչ բացատրություն</div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Արդյունքում ստանում ենք n(k+1) = (n−k)(n−k−1), իսկ դրանից.
        </p>
        <div class="text-center py-1">
          <KaTeXFormula :formula="`C(n,k) = C(n-1,k+1)`" :displayMode="true" />
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Այսպիսով Լինդի ընտանիքի բախումները հիմնված են ոչ թե պատահական թվային համընկնումների, այլ Ֆիբոնաչիի թվերի խորքային կառուցվածքի վրա։
        </p>
      </div>

      <div class="bg-slate-800/40 rounded-lg p-3 space-y-2">
        <div class="text-[10px] text-yellow-300 font-medium">Կապը աշխատանքի հետ</div>
        <p class="text-xs text-slate-400 leading-relaxed">
          Մեր աշխատանքում n-չափանի խորանարդի գագաթների համարժեքության դասերի չափերը տրվում են բինոմիալ գործակիցներով։ Երբ տարբեր k արժեքների համար առաջանում են հավասար բինոմիալ գործակիցներ, դա նշանակում է, որ տարբեր run-count դասեր ունեն նույն հզորությունը՝ չնայած իրենց տարբեր կոմբինատոր կառուցվածքին։ Լինդի ընտանիքը ցույց է տալիս, որ նման համընկնումները համակարգված են և կանխատեսելի, այլ ոչ թե պատահական։
        </p>
      </div>
    </div>
  </div>
</template>