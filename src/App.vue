<script setup>
import { ref, provide } from 'vue'
import { useHypercube } from './composables/useHypercube.js'
import HypercubeScene from './components/HypercubeScene.vue'
import InfoPanel from './components/InfoPanel.vue'
import VertexHUD from './components/VertexHUD.vue'
import RleDemoPanel from './components/RleDemoPanel.vue'
import PreimageExplorer from './components/PreimageExplorer.vue'
import SimulationPanel from './components/SimulationPanel.vue'
import PartitionCheck from './components/PartitionCheck.vue'

const canvasRef = ref(null)
const hc = useHypercube(canvasRef)
provide('hypercube', hc)
provide('canvasRef', canvasRef)

const showInfoPanel = ref(false)
function toggleInfoPanel() { showInfoPanel.value = !showInfoPanel.value }

const tabs = [
  { id: 'classes', label: 'Classes' },
  { id: 'rle', label: 'RLE' },
  { id: 'preimages', label: 'Preimages' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'proof', label: 'Proof' },
]
const currentTab = ref('classes')
</script>

<template>
  <div class="h-screen w-screen bg-slate-950 text-white overflow-hidden flex flex-col">
    <div class="h-8 shrink-0 flex items-center px-3 md:px-4 border-b border-white/5">
      <button
        class="md:hidden mr-2 text-slate-400 hover:text-white transition-colors p-0.5"
        @click="toggleInfoPanel"
        aria-label="Toggle info panel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
        </svg>
      </button>
      <span class="text-[11px] font-medium text-slate-400 tracking-wide">
        Hypercube Visualizer
      </span>
    </div>
    <div class="flex-1 flex overflow-hidden p-2 gap-2">
      <div class="flex-1 min-w-0">
        <HypercubeScene />
      </div>
      <div class="hidden md:flex w-72 shrink-0 flex-col glass-panel-strong rounded-xl overflow-hidden">
        <div class="flex border-b border-white/5 shrink-0 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'flex-1 text-[10px] py-2 font-medium transition-colors relative',
              currentTab === tab.id
                ? 'text-blue-300'
                : 'text-slate-500 hover:text-slate-300',
            ]"
          >
            {{ tab.label }}
            <div
              v-if="currentTab === tab.id"
              class="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500/60 rounded-full"
            ></div>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-3 py-3">
          <InfoPanel v-if="currentTab === 'classes'" />
          <RleDemoPanel v-else-if="currentTab === 'rle'" />
          <PreimageExplorer v-else-if="currentTab === 'preimages'" />
          <SimulationPanel v-else-if="currentTab === 'simulation'" />
          <PartitionCheck v-else-if="currentTab === 'proof'" />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showInfoPanel" class="fixed inset-0 z-50 md:hidden">
        <div class="absolute inset-0 bg-black/50" @click="showInfoPanel = false"></div>
        <div class="absolute inset-y-0 right-0 w-[85vw] max-w-sm">
          <div class="h-full flex flex-col glass-panel-strong rounded-l-xl overflow-hidden">
            <div class="flex border-b border-white/5 shrink-0 overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="currentTab = tab.id"
                :class="[
                  'flex-1 text-[10px] py-2 font-medium transition-colors relative',
                  currentTab === tab.id
                    ? 'text-blue-300'
                    : 'text-slate-500 hover:text-slate-300',
                ]"
              >
                {{ tab.label }}
                <div
                  v-if="currentTab === tab.id"
                  class="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500/60 rounded-full"
                ></div>
              </button>
            </div>
            <button
              @click="showInfoPanel = false"
              class="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-slate-800/80 text-slate-400 hover:text-white text-xs border border-white/10 transition-colors"
            >✕</button>
            <div class="flex-1 overflow-y-auto px-3 py-3">
              <InfoPanel v-if="currentTab === 'classes'" />
              <RleDemoPanel v-else-if="currentTab === 'rle'" />
              <PreimageExplorer v-else-if="currentTab === 'preimages'" />
              <SimulationPanel v-else-if="currentTab === 'simulation'" />
              <PartitionCheck v-else-if="currentTab === 'proof'" />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <VertexHUD />
  </div>
</template>
