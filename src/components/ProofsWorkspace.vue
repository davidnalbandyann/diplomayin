<script setup>
import { inject } from 'vue'
import KaTeXFormula from './KaTeXFormula.vue'

const appState = inject('appState')
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-4xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Theorems &amp; Proofs</h2>
      <p class="text-xs text-slate-500 mt-1">
        Formal results underlying the run-length reduction equivalence structure.
      </p>
    </div>

    <!-- Card 1: Equivalence Relation -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-blue-500/20 text-blue-300 text-[10px] flex items-center justify-center font-mono">1</span>
        Equivalence Relation
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Define a relation ~ on <span class="font-mono text-slate-300">Σⁿ</span> by
        <span class="font-mono text-slate-200">x ~ z</span> iff
        <span class="font-mono text-emerald-300">g(x) = g(z)</span>.
        Then ~ is an equivalence relation.
      </p>
      <ul class="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
        <li><strong class="text-slate-300">Reflexive:</strong> g(x) = g(x) for all x, so x ~ x.</li>
        <li><strong class="text-slate-300">Symmetric:</strong> If x ~ z then g(x) = g(z) → g(z) = g(x) → z ~ x.</li>
        <li><strong class="text-slate-300">Transitive:</strong> If x ~ z and z ~ w then g(x) = g(z) = g(w) → x ~ w.</li>
      </ul>
      <p class="text-xs text-slate-400 leading-relaxed">
        Therefore ~ partitions <span class="font-mono text-slate-300">Σⁿ</span> into disjoint equivalence classes identified by alternating reduced strings y. Each class H(y, n) = {x ∈ Σⁿ : g(x) = y} is non-empty for any alternating y of length 1 ≤ k ≤ n.
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Example:</strong> n = 4. The class for y = 10 contains {1000, 1100, 1110}. g(1000) = 10, g(1100) = 10, g(1110) = 10.
      </div>
    </div>

    <!-- Card 2: Preimage Count -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center justify-center font-mono">2</span>
        Preimage Count
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Let y be an alternating binary string of length k. The number of strings x ∈ Σⁿ with g(x) = y is:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`|g^{-1}(y) \\cap \\Sigma^n| = C(n - 1, k - 1)`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Proof.</strong> A preimage x is uniquely determined by its run lengths l₁, …, lₖ, where lᵢ ≥ 1 and Σ lᵢ = n. The number of positive integer solutions to this equation is C(n – 1, k – 1), the number of compositions of n into k parts. Each composition corresponds to expanding y by repeating its i-th bit lᵢ times.
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Example:</strong> n = 5, y = 101 (k = 3). C(4, 2) = 6 preimages: 10111, 10011, 10001, 11011, 11001, 11101. For each, g(x) = 101.
      </div>
    </div>

    <!-- Card 3: Stars and Bars -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-mono">3</span>
        Stars-and-Bars Derivation
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        The stars-and-bars method provides a direct combinatorial proof of the preimage count:
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        Place <span class="font-mono text-slate-200">n</span> indistinguishable units (stars) in a row. There are <span class="font-mono text-slate-200">n – 1</span> gaps between adjacent units. Choose <span class="font-mono text-slate-200">k – 1</span> gaps to insert separators (bars). This splits the stars into <span class="font-mono text-slate-200">k</span> groups, each containing at least one star, corresponding to the run lengths l₁, …, lₖ.
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\#\\text{selections} = C(n - 1, k - 1)`" :displayMode="true" />
      </div>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400 text-center font-mono text-lg leading-relaxed">
        ● ● <span class="text-blue-400">│</span> ● ● ● <span class="text-blue-400">│</span> ● ●
        <div class="text-[10px] text-slate-500 mt-1">n = 7, k = 3, composition [2, 3, 2]</div>
      </div>
    </div>

    <!-- Card 4: Generating Function -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-purple-500/20 text-purple-300 text-[10px] flex items-center justify-center font-mono">4</span>
        Generating Function Derivation
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        Each run length contributes a generating function for positive integers:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`x + x^2 + x^3 + \\cdots = \\frac{x}{1 - x}`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        For k runs, the generating function for compositions of n into k parts is:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\Phi(x) = \\left(\\frac{x}{1 - x}\\right)^k = x^k \\cdot (1 - x)^{-k}`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Expanding using the negative binomial series:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula
          :formula="`(1 - x)^{-k} = \\sum_{m=0}^\\infty C(m + k - 1, k - 1) x^m`"
          :displayMode="true"
        />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Multiplying by xᵏ shifts the index, giving the coefficient of xⁿ as C(n – 1, k – 1).
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Example:</strong> k = 3: Φ(x) = x³/(1 – x)³. The coefficient of x⁵ is C(4,2) = 6.
      </div>
    </div>

    <!-- Card 5: Hockey-Stick -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-rose-500/20 text-rose-300 text-[10px] flex items-center justify-center font-mono">5</span>
        Hockey-Stick Identity
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        For a fixed alternating string y of length k, the cumulative number of preimages across all dimensions m = k, k+1, …, n satisfies:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\sum_{m=k}^n C(m - 1, k - 1) = C(n, k)`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Proof.</strong> By the hockey-stick identity (Pascal's rule applied repeatedly): C(k–1, k–1) + C(k, k–1) + … + C(n–1, k–1) = C(n, k).
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        This counts all strings of lengths k through n that reduce to y, a key step in analyzing the growth of class sizes with dimension.
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Example:</strong> y = 101 (k = 3), n = 5: C(2,2) + C(3,2) + C(4,2) = 1 + 3 + 6 = 10 = C(5,3).
      </div>
    </div>

    <!-- Card 6: Partition Completeness -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">6</span>
        Partition Completeness
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        The equivalence classes H(y, n) partition <span class="font-mono text-slate-300">Σⁿ</span> exactly. For each dimension n:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula
          :formula="`\\sum_{k=1}^n 2 \\cdot C(n - 1, k - 1) = 2^n`"
          :displayMode="true"
        />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Proof.</strong> For each k (1 ≤ k ≤ n), there are exactly 2 alternating binary strings of length k — one starting with 0 and one starting with 1. Each such y has class size C(n – 1, k – 1). Summing:
      </p>
      <div class="text-center py-1">
        <KaTeXFormula :formula="`\\sum_{k=1}^n 2 \\cdot C(n - 1, k - 1) = 2 \\cdot 2^{n-1} = 2^n = |\\Sigma^n|`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Since classes are disjoint (they are equivalence classes) and the sum of their sizes equals the size of <span class="font-mono text-slate-300">Σⁿ</span>, every binary string belongs to exactly one class.
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Example:</strong> n = 4. k=1: 2×1=2, k=2: 2×3=6, k=3: 2×3=6, k=4: 2×1=2. Total = 16 = 2⁴. For n = {{ appState.dimension }}, the Distribution tab verifies this identity.
      </div>
    </div>

    <!-- Card 7: Asymptotic Behavior -->
    <div class="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
      <h3 class="text-sm font-semibold text-slate-200 flex items-center gap-2">
        <span class="w-5 h-5 rounded bg-orange-500/20 text-orange-300 text-[10px] flex items-center justify-center font-mono">7</span>
        Asymptotic Behavior of Run Count
      </h3>
      <p class="text-xs text-slate-400 leading-relaxed">
        For a uniformly random binary string x ∈ Σⁿ (independent fair coin flips), the run count K = runCount(x) has:
      </p>
      <div class="text-center py-2">
        <KaTeXFormula :formula="`\\mathbb{E}[K] = \\frac{n + 1}{2},\\qquad \\mathrm{Var}(K) = \\frac{n - 1}{4}`" :displayMode="true" />
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Derivation.</strong> Write K = 1 + Σ_{i=2}^{n} I(bᵢ ≠ b_{i-1}). Each indicator is a Bernoulli(1/2) random variable, and adjacent indicators are independent. The expected number of bit changes is (n – 1)/2, so E[K] = 1 + (n – 1)/2 = (n + 1)/2. Variance follows from independence.
      </p>
      <p class="text-xs text-slate-400 leading-relaxed">
        <strong class="text-slate-300">Implication.</strong> For large n, K concentrates around n/2. A typical random string has compression ratio k/n ≈ 50%, yielding minimal RLE savings. RLE is most effective for structured strings with long repeated runs (small k), such as those found in images, genomic data, or other non-random sources.
      </p>
      <div class="bg-slate-800/40 rounded-lg p-3 text-xs text-slate-400">
        <strong class="text-slate-300">Example:</strong> n = 100, E[K] = 50.5. A string with k = 3 (saving 97%) requires highly structured input like alternating runs of length ~33 — exponentially unlikely under randomness. The Simulation tab demonstrates this experimentally.
      </div>
    </div>
  </div>
</template>
