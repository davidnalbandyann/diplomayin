<script setup>
import { ref, provide } from 'vue'
import { N_MIN, N_MAX, N_MAX_ANALYSIS } from './config.js'
import { useAppState } from './composables/useAppState.js'
import ClassesWorkspace from './components/ClassesWorkspace.vue'
import RleWorkspace from './components/RleWorkspace.vue'
import PreimageWorkspace from './components/PreimageWorkspace.vue'
import StarsBarsWorkspace from './components/StarsBarsWorkspace.vue'
import DistributionWorkspace from './components/DistributionWorkspace.vue'
import SimulationWorkspace from './components/SimulationWorkspace.vue'
import ProofsWorkspace from './components/ProofsWorkspace.vue'
import ThesisWorkspace from './components/ThesisWorkspace.vue'

const appState = useAppState()
provide('appState', appState)

const showMobileMenu = ref(false)

const tabs = [
  { id: 'classes', label: 'Դասեր' },
  { id: 'rle', label: 'RLE կոդավորում' },
  { id: 'preimages', label: 'Նախապատկերներ' },
  { id: 'starsbars', label: 'Աստղեր և ձողեր' },
  { id: 'distribution', label: 'Բաշխում' },
  { id: 'simulation', label: 'Սիմուլյացիա' },
  { id: 'proofs', label: 'Ապացույցներ' },
  { id: 'thesis', label: 'Պրեզենտացիա' },
]

const workspaceComponents = {
  classes: ClassesWorkspace,
  rle: RleWorkspace,
  preimages: PreimageWorkspace,
  starsbars: StarsBarsWorkspace,
  distribution: DistributionWorkspace,
  simulation: SimulationWorkspace,
  proofs: ProofsWorkspace,
  thesis: ThesisWorkspace,
}
</script>

<template>
  <div class="h-screen w-screen bg-slate-950 text-white overflow-hidden flex flex-col">
    <header class="shrink-0 border-b border-white/5">
      <div class="h-9 flex items-center px-3 md:px-4 gap-3">
        <button
          class="md:hidden mr-1 text-slate-400 hover:text-white transition-colors p-0.5"
          @click="showMobileMenu = !showMobileMenu"
          aria-label="Toggle mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
          </svg>
        </button>
        <span class="text-[11px] font-medium text-slate-400 tracking-wide hidden sm:inline">Հիպերխորանարդի վիզուալիզատոր</span>
        <div class="flex items-center gap-3 ml-auto md:ml-0">
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-slate-500">Cube</span>
            <input
              type="number"
              :min="N_MIN"
              :max="N_MAX"
              :value="appState.cubeDimension"
              @input="appState.setCubeDimension(parseInt($event.target.value) || N_MIN)"
              class="w-7 sm:w-8 bg-transparent text-xs font-bold text-blue-400 tabular-nums text-center border-b border-blue-500/30 focus:outline-none focus:border-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input
              type="range"
              :min="N_MIN"
              :max="N_MAX"
              :value="appState.cubeDimension"
              @input="appState.setCubeDimension(parseInt($event.target.value))"
              class="w-12 sm:w-16 cursor-pointer"
            />
          </div>
          <span class="text-slate-600 text-[10px]">|</span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-slate-500">Analysis</span>
            <input
              type="number"
              :min="N_MIN"
              :max="N_MAX_ANALYSIS"
              :value="appState.workspaceDimension"
              @input="appState.setWorkspaceDimension(parseInt($event.target.value) || N_MIN)"
              class="w-7 sm:w-8 bg-transparent text-xs font-bold text-emerald-400 tabular-nums text-center border-b border-emerald-500/30 focus:outline-none focus:border-emerald-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <input
              type="range"
              :min="N_MIN"
              :max="N_MAX_ANALYSIS"
              :value="appState.workspaceDimension"
              @input="appState.setWorkspaceDimension(parseInt($event.target.value))"
              class="w-12 sm:w-16 cursor-pointer"
            />
          </div>
        </div>
        <div v-if="appState.selectedBinaryString" class="hidden md:flex items-center gap-2 ml-2 text-[10px]">
          <span class="text-slate-600">|</span>
          <span class="text-slate-500">x:</span>
          <span class="font-mono text-slate-300">{{ appState.selectedBinaryString }}</span>
          <span v-if="appState.selectedReducedString" class="text-slate-500">y:</span>
          <span v-if="appState.selectedReducedString" class="font-mono text-emerald-300">{{ appState.selectedReducedString }}</span>
        </div>
      </div>
      <nav class="flex overflow-x-auto border-t border-white/5 bg-slate-900/50">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="appState.setActiveTab(tab.id)"
          :class="[
            'text-[10px] sm:text-[11px] px-3 sm:px-4 py-2 font-medium transition-colors relative shrink-0 whitespace-nowrap',
            appState.activeTab === tab.id
              ? 'text-blue-300'
              : 'text-slate-500 hover:text-slate-300',
          ]"
        >
          {{ tab.label }}
          <div
            v-if="appState.activeTab === tab.id"
            class="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500/60 rounded-full"
          ></div>
        </button>
      </nav>
    </header>

    <main class="flex-1 overflow-hidden p-2">
      <ClassesWorkspace v-if="appState.activeTab === 'classes'" />
      <RleWorkspace v-else-if="appState.activeTab === 'rle'" />
      <PreimageWorkspace v-else-if="appState.activeTab === 'preimages'" />
      <StarsBarsWorkspace v-else-if="appState.activeTab === 'starsbars'" />
      <DistributionWorkspace v-else-if="appState.activeTab === 'distribution'" />
      <SimulationWorkspace v-else-if="appState.activeTab === 'simulation'" />
      <ProofsWorkspace v-else-if="appState.activeTab === 'proofs'" />
      <ThesisWorkspace v-else-if="appState.activeTab === 'thesis'" />
    </main>

    <Teleport to="body">
      <div v-if="showMobileMenu" class="fixed inset-0 z-50 md:hidden">
        <div class="absolute inset-0 bg-black/50" @click="showMobileMenu = false"></div>
        <div class="absolute inset-y-0 right-0 w-[75vw] max-w-xs glass-panel-strong overflow-y-auto">
          <div class="p-4 space-y-1">
            <div class="text-xs text-slate-500 font-medium mb-3">Բաժիններ</div>
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="appState.setActiveTab(tab.id); showMobileMenu = false"
              :class="[
                'block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors',
                appState.activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-slate-400 hover:bg-white/5',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>