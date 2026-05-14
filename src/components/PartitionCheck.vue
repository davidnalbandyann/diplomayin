<script setup>
import { inject, computed } from 'vue'
import { binomial, theoreticalSize } from '../utils/cubeMath.js'
import KaTeXFormula from './KaTeXFormula.vue'

const hc = inject('hypercube')

const entries = computed(() => {
  const n = hc.n.value
  const result = []
  for (let k = 1; k <= n; k++) {
    result.push({
      k,
      images: 2,
      classSize: binomial(n - 1, k - 1),
      total: theoreticalSize(n, k),
    })
  }
  return result
})

const computedTotal = computed(() => {
  return entries.value.reduce((sum, e) => sum + e.total, 0)
})

const expectedTotal = computed(() => {
  return Math.pow(2, hc.n.value)
})

const isValid = computed(() => computedTotal.value === expectedTotal.value)
</script>

<template>
  <div class="space-y-3">
    <div class="bg-white/[0.03] rounded-lg p-3 space-y-2">
      <div class="text-[11px] text-slate-400 font-medium">Տրոհման ստուգում</div>
      <div class="text-center py-2 text-sm">
        <KaTeXFormula
          :formula="`\\sum_{k=1}^{${hc.n.value}} 2 \\cdot \\binom{${hc.n.value} - 1}{k - 1} = 2^{${hc.n.value}}`"
          :displayMode="true"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-[10px]">
          <thead>
            <tr class="text-slate-500 border-b border-white/5">
              <th class="text-left py-1 pr-2 font-medium">k</th>
              <th class="text-right px-2 py-1 font-medium">Պատկերներ</th>
              <th class="text-right px-2 py-1 font-medium">Դասի հզորություն</th>
              <th class="text-right px-2 py-1 font-medium">Ընդամենը</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in entries"
              :key="e.k"
              class="border-b border-white/[0.02]"
            >
              <td class="py-1 pr-2 font-mono text-slate-400">{{ e.k }}</td>
              <td class="text-right px-2 py-1 font-mono text-slate-300">{{ e.images }}</td>
              <td class="text-right px-2 py-1 font-mono text-slate-300">{{ e.classSize }}</td>
              <td class="text-right px-2 py-1 font-mono text-slate-300">{{ e.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border-t border-white/5 pt-2 mt-2 space-y-1">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Հաշվարկված ընդհանուր քանակ</span>
          <span class="font-mono text-slate-300">{{ computedTotal.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Սպասվող (2<sup>{{ hc.n.value }}</sup>)</span>
          <span class="font-mono text-slate-300">{{ expectedTotal.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between text-[11px] pt-1">
          <span class="text-slate-500">Ստուգում</span>
          <span
            :class="[
              'text-[10px] font-mono px-1.5 py-0.5 rounded',
              isValid ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40',
            ]"
          >
            {{ isValid ? 'վավեր է ✓' : 'անհամապատասխանություն ✗' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
