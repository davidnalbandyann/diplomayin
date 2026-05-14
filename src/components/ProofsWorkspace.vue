<script setup>
import { inject } from 'vue'
import KaTeXFormula from './KaTeXFormula.vue'
import PascalTriangleProof from './PascalTriangleProof.vue'

const appState = inject('appState')
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
  </div>
</template>