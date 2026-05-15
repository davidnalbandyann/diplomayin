import { ref, computed, reactive, watch } from 'vue'
import { reduceRuns, getRunLengths, getRunCount, getCompressionStats } from '../utils/cubeMath.js'
import { N_MIN, N_MAX, N_MAX_ANALYSIS } from '../config.js'

export function useAppState() {
  const cubeDimension = ref(3)
  const workspaceDimension = ref(3)
  const activeTab = ref('thesis')
  const selectedBinaryString = ref(null)
  const selectedReducedString = ref(null)
  const theme = ref(getInitialTheme())

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

  function setCubeDimension(val) {
    cubeDimension.value = Math.max(N_MIN, Math.min(N_MAX, val))
  }

  function setWorkspaceDimension(val) {
    workspaceDimension.value = Math.max(N_MIN, Math.min(N_MAX_ANALYSIS, val))
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

  function getInitialTheme() {
    if (typeof window === 'undefined') return 'light'
    const saved = window.localStorage.getItem('hypercube-theme')
    return saved === 'dark' || saved === 'light' ? saved : 'light'
  }

  function applyTheme(val) {
    if (typeof document === 'undefined') return
    const next = val === 'dark' ? 'dark' : 'light'
    document.documentElement.classList.toggle('theme-dark', next === 'dark')
    document.documentElement.classList.toggle('theme-light', next === 'light')
    document.body.classList.toggle('theme-dark', next === 'dark')
    document.body.classList.toggle('theme-light', next === 'light')
    document.documentElement.style.colorScheme = next
    window.localStorage.setItem('hypercube-theme', next)
  }

  function setTheme(val) {
    theme.value = val === 'dark' ? 'dark' : 'light'
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  watch(theme, applyTheme, { immediate: true })

  return reactive({
    cubeDimension,
    workspaceDimension,
    activeTab,
    selectedBinaryString,
    selectedReducedString,
    theme,
    selectedRunLengths,
    selectedRunCount,
    selectedCompressionStats,
    setCubeDimension,
    setWorkspaceDimension,
    setActiveTab,
    setSelectedBinaryString,
    setSelectedReducedString,
    clearSelection,
    setTheme,
    toggleTheme,
  })
}
