<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  formula: { type: String, required: true },
  displayMode: { type: Boolean, default: false },
})

const html = computed(() => {
  try {
    return katex.renderToString(props.formula, {
      displayMode: props.displayMode,
      throwOnError: false,
      output: 'html',
    })
  } catch {
    return props.formula
  }
})
</script>

<template>
  <span v-html="html" class="katex-inline"></span>
</template>
