<script setup>
import { inject, computed } from 'vue'
import { binomial, theoreticalSize, colorForK } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const appState = inject('appState')

const entries = computed(() => {
  const n = appState.dimension
  const result = []
  for (let k = 1; k <= n; k++) {
    result.push({
      k,
      images: 2,
      classSize: binomial(n - 1, k - 1),
      total: theoreticalSize(n, k),
      color: colorForK(k, n),
    })
  }
  return result
})

const computedTotal = computed(() => entries.value.reduce((s, e) => s + e.total, 0))
const expectedTotal = computed(() => Math.pow(2, appState.dimension))
const isValid = computed(() => computedTotal.value === expectedTotal.value)

const maxTotal = computed(() => Math.max(...entries.value.map(e => e.total), 1))
</script>

<template>
  <div class="h-full overflow-y-auto px-4 py-4 md:px-8 md:py-6 max-w-3xl mx-auto space-y-6">
    <div>
      <h2 class="text-base font-semibold text-slate-200">Distribution Over k</h2>
      <p class="text-xs text-slate-500 mt-1">
        How the 2<sup>{{ appState.dimension }}</sup> vertices are partitioned into equivalence classes by run count.
      </p>
    </div>

    <div class="bg-white/[0.03] rounded-xl p-4 space-y-2">
      <div class="flex items-end gap-1.5 h-28">
        <div
          v-for="e in entries"
          :key="e.k"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <div class="w-full relative flex-1">
            <div
              :style="{
                height: (e.total / maxTotal) * 100 + '%',
                background: e.color,
              }"
              class="absolute bottom-0 left-0.5 right-0.5 rounded-t opacity-80"
            ></div>
          </div>
          <span class="text-[9px] font-mono text-slate-500">k={{ e.k }}</span>
        </div>
      </div>
    </div>

    <div class="bg-white/[0.03] rounded-xl overflow-hidden">
      <table class="w-full text-xs">
        <thead>
          <tr class="text-slate-500 border-b border-white/5">
            <th class="text-left py-2 px-3 font-medium">k</th>
            <th class="text-right px-2 py-2 font-medium">Images</th>
            <th class="text-right px-2 py-2 font-medium">Class size</th>
            <th class="text-right px-3 py-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="e in entries"
            :key="e.k"
            class="border-b border-white/[0.02]"
          >
            <td class="py-1.5 px-3 font-mono text-slate-400">{{ e.k }}</td>
            <td class="text-right px-2 py-1.5 font-mono text-slate-300">{{ e.images }}</td>
            <td class="text-right px-2 py-1.5 font-mono text-slate-300">{{ e.classSize }}</td>
            <td class="text-right px-3 py-1.5 font-mono text-slate-300">{{ e.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-white/[0.03] rounded-xl p-4 space-y-3">
      <div class="text-center py-2">
        <KaTeXFormula
          :formula="`\\sum_{k=1}^{${appState.dimension}} 2 \\cdot \\binom{${appState.dimension} - 1}{k - 1} = 2^{${appState.dimension}}`"
          :displayMode="true"
        />
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="text-slate-500">Computed total</span>
        <span class="font-mono text-slate-300">{{ computedTotal.toLocaleString() }}</span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="text-slate-500">Expected (2<sup>{{ appState.dimension }}</sup>)</span>
        <span class="font-mono text-slate-300">{{ expectedTotal.toLocaleString() }}</span>
      </div>
      <div class="flex items-center justify-between text-xs pt-1 border-t border-white/5">
        <span class="text-slate-500">Verification</span>
        <span
          :class="[
            'text-xs font-mono px-1.5 py-0.5 rounded',
            isValid ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40',
          ]"
        >
          {{ isValid ? 'valid ✓' : 'mismatch ✗' }}
        </span>
      </div>
    </div>
  </div>
</template>
