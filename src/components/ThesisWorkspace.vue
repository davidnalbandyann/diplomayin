<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed'

const currentPage = ref(1)
const numPages = ref(0)

const loading = ref(true)
const error = ref(null)
const isFullscreen = ref(false)
const viewerEl = ref(null)

const pdfSource = '/thesis.pdf'

const canPrev = computed(() => currentPage.value > 1)
const canNext = computed(() => currentPage.value < numPages.value)

function goPrev() {
  if (canPrev.value) currentPage.value--
}

function goNext() {
  if (canNext.value) currentPage.value++
}

function goToPage(e) {
  const p = parseInt(e.target.value)
  if (p >= 1 && p <= numPages.value) {
    currentPage.value = p
  }
}


function toggleFullscreen() {
  if (!document.fullscreenElement) {
    viewerEl.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function onLoaded(pdf) {
  numPages.value = pdf.numPages
  loading.value = false
}

function onProgress(progress) {
  if (progress.loaded < progress.total) {
    loading.value = true
  }
}

function onRendered() {
  loading.value = false
}

function onError(err) {
  error.value = err
  loading.value = false
}

async function download() {
  try {
    const resp = await fetch(pdfSource)
    const blob = await resp.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'thesis.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    window.open(pdfSource, '_blank')
  }
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft') { goPrev(); e.preventDefault() }
  if (e.key === 'ArrowRight') { goNext(); e.preventDefault() }
  if (e.key === 'Home') { currentPage.value = 1; e.preventDefault() }
  if (e.key === 'End') { currentPage.value = numPages.value; e.preventDefault() }
  if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); e.preventDefault() }
  if (e.key === 'Escape' && isFullscreen.value) { document.exitFullscreen(); e.preventDefault() }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <div ref="viewerEl" class="h-full flex flex-col">
    <div class="shrink-0 flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/5"
      :class="{ 'hidden': isFullscreen }">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-semibold text-slate-200">Պրեզենտացիա</h2>
        <span v-if="!loading && numPages > 0" class="text-[10px] text-slate-500">
          {{ numPages }} սլայդ
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button @click="download"
          class="text-[10px] px-2.5 py-1 rounded-lg bg-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors border border-white/5">
          ⬇ PDF
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-h-0 bg-slate-950/30">
      <div v-if="error" class="flex-1 flex items-center justify-center">
        <div class="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 text-center max-w-sm">
          <div class="text-xs text-rose-300 mb-1">✗ Չհաջողվեց բացել PDF</div>
          <p class="text-[10px] text-slate-500">Համոզվեք, որ thesis.pdf ֆայլը գոյություն ունի</p>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col min-h-0">
        <div class="flex-1 relative overflow-hidden">
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-10">
            <div class="flex flex-col items-center gap-2">
              <div class="w-6 h-6 border-2 border-slate-600 border-t-teal-400 rounded-full animate-spin"></div>
              <span class="text-[10px] text-slate-500">Բեռնվում է…</span>
            </div>
          </div>
          <div class="h-full overflow-y-auto flex items-start justify-center py-4 px-4"
            :class="{ 'py-2 px-2': isFullscreen }">
            <div class="w-full max-w-4xl"
              :class="{ 'max-w-none': isFullscreen }">
              <div class="bg-white rounded-lg shadow-xl overflow-hidden"
                :class="{ 'opacity-0 absolute': loading, 'rounded-none': isFullscreen }">
                <VuePdfEmbed
                  :source="pdfSource"
                  :page="currentPage"
                  @loaded="onLoaded"
                  @progress="onProgress"
                  @rendered="onRendered"
                  @loading-failed="onError"
                  @rendering-failed="onError"
                />
              </div>
            </div>
          </div>

          <div v-if="isFullscreen"
            class="absolute top-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-b from-slate-900/80 to-transparent flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
            <span class="text-[10px] text-slate-400 font-mono">
              {{ currentPage }} / {{ numPages }}
            </span>
            <div class="flex items-center gap-1">
              <button @click="toggleFullscreen"
                class="text-[10px] px-1.5 py-0.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                ⛶
              </button>
            </div>
          </div>
        </div>

        <div class="shrink-0 flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-900/60 border-t border-white/5">
          <button @click="goPrev" :disabled="!canPrev"
            class="px-2 py-1 rounded text-xs font-mono transition-colors"
            :class="canPrev ? 'text-slate-300 hover:bg-slate-700/40' : 'text-slate-600 cursor-not-allowed'">
            ◀
          </button>

          <div class="flex items-center gap-1.5">
            <input type="number" :value="currentPage" @change="goToPage"
              min="1" :max="numPages"
              class="w-10 bg-slate-800/60 border border-white/10 rounded px-1.5 py-1 text-xs font-mono text-slate-200 text-center focus:outline-none focus:border-teal-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            <span class="text-xs text-slate-500 font-mono">/ {{ numPages }}</span>
          </div>

          <button @click="goNext" :disabled="!canNext"
            class="px-2 py-1 rounded text-xs font-mono transition-colors"
            :class="canNext ? 'text-slate-300 hover:bg-slate-700/40' : 'text-slate-600 cursor-not-allowed'">
            ▶
          </button>

          <div class="w-px h-4 bg-white/10 mx-1"></div>

          <button @click="toggleFullscreen"
            class="text-[11px] px-2 py-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition-colors"
            :title="isFullscreen ? 'Ավելի փոքր' : 'Լրիվ էկրան'">
            {{ isFullscreen ? '⛶' : '⛶' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
