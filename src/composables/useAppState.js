import { ref, computed, reactive } from 'vue'
import { reduceRuns, getRunLengths, getRunCount, getCompressionStats } from '../utils/cubeMath.js'
import { N_MIN, N_MAX } from '../config.js'

export function useAppState() {
  const dimension = ref(3)
  const activeTab = ref('classes')
  const selectedBinaryString = ref(null)
  const selectedReducedString = ref(null)

  const selectedRunLengths = computed(() => {
    if (!selectedBinaryString.value) return null
    return getRunLengths(selectedBinaryString.value.split('').map(Number))
  })

  const selectedRunCount = computed(() => {
    if (!selectedBinaryString.value) return null
    return getRunCount(selectedBinaryString.value.split('').map(Number))
  })

  const selectedCompressionStats = computed(() => {
    if (!selectedBinaryString.value) return null
    return getCompressionStats(selectedBinaryString.value.split('').map(Number))
  })

  function setDimension(val) {
    dimension.value = Math.max(N_MIN, Math.min(N_MAX, val))
  }

  function setActiveTab(val) {
    activeTab.value = val
  }

  function setSelectedBinaryString(val) {
    selectedBinaryString.value = val
    if (val !== null) {
      selectedReducedString.value = reduceRuns(val.split('').map(Number))
    }
  }

  function setSelectedReducedString(val) {
    selectedReducedString.value = val
  }

  function clearSelection() {
    selectedBinaryString.value = null
    selectedReducedString.value = null
  }

  return reactive({
    dimension,
    activeTab,
    selectedBinaryString,
    selectedReducedString,
    selectedRunLengths,
    selectedRunCount,
    selectedCompressionStats,
    setDimension,
    setActiveTab,
    setSelectedBinaryString,
    setSelectedReducedString,
    clearSelection,
  })
}
