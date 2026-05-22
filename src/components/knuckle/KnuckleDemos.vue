<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL

type Phase = 'cluster' | 'cpu' | 'storage' | 'progress'

const phase = ref<Phase>('cluster')
let timer: ReturnType<typeof setTimeout>

const sequence: Array<{ phase: Phase, duration: number }> = [
  { phase: 'cluster', duration: 10000 },
  { phase: 'cpu', duration: 10000 },
  { phase: 'storage', duration: 10000 },
  { phase: 'progress', duration: 8000 },
]
let idx = 0

function cycle() {
  const current = sequence[idx]
  timer = setTimeout(() => {
    idx = (idx + 1) % sequence.length
    phase.value = sequence[idx].phase
    cycle()
  }, current.duration)
}

onMounted(() => cycle())
onUnmounted(() => clearTimeout(timer))

const isWebUI = (p: Phase) => p !== 'progress'

const subtitleMap: Record<Phase, string> = {
  cluster: 'cluster overview',
  cpu: 'node metrics',
  storage: 'storage',
  progress: 'installing',
}
</script>

<template>
  <section class="knuckle-demos">
    <div class="demo-window">
      <!-- Browser chrome for WebUI, Ghostty chrome for TUI -->
      <template v-if="isWebUI(phase)">
        <div class="browser-bar">
          <div class="browser-spacer" />
          <div class="browser-url">
            <span class="browser-url-text">bluespeed · {{ subtitleMap[phase] }}</span>
          </div>
          <button class="hb-min-btn" aria-label="Minimize" tabindex="-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <button class="hb-max-btn" aria-label="Maximize" tabindex="-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          </button>
          <button class="hb-close-btn" aria-label="Close" tabindex="-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </template>

      <transition name="fade" mode="out-in">
        <img
          v-if="phase === 'cluster'"
          key="cluster"
          :src="`${baseUrl}bluespeed-cluster.png`"
          alt="Bluespeed cluster overview dashboard"
        >
        <img
          v-else-if="phase === 'cpu'"
          key="cpu"
          :src="`${baseUrl}bluespeed-cpu.png`"
          alt="Bluespeed node CPU metrics"
        >
        <img
          v-else-if="phase === 'storage'"
          key="storage"
          :src="`${baseUrl}bluespeed-storage.png`"
          alt="Bluespeed storage view"
        >
        <div v-else key="progress" class="tui-frame">
          <p class="tui-caption">
            Just one quick TUI install to get the web dashboard up and running.
          </p>
          <img
            :src="`${baseUrl}knuckle-progress.png`"
            alt="Knuckle installer progress"
          >
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.knuckle-demos {
  width: 100%;
}

.demo-window {
  border-radius: 12px;
  overflow: hidden;
  background: #1d1d20;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 20px 48px rgba(0, 0, 0, 0.3);

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

/* ── Browser chrome (WebUI) — Adwaita CSD style ── */
.browser-bar {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 6px;
  background: #303030;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
  user-select: none;
  gap: 4px;
}

.browser-spacer {
  width: 82px; /* mirrors 3 buttons on right for visual balance */
  flex-shrink: 0;
}

.browser-url {
  flex: 1;
  display: flex;
  justify-content: center;
}

.browser-url-text {
  font-family: Cantarell, 'Noto Sans', system-ui, sans-serif;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 3px 14px;
  min-width: 180px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Adw.HeaderBar (TUI screenshot) ── */
.adw-header-bar {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 6px;
  background: #303030;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
  user-select: none;
  gap: 4px;
}

.hb-start,
.hb-end {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.hb-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  line-height: 1.2;
}

.hb-title-text {
  font-family: Cantarell, 'Noto Sans', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hb-subtitle-text {
  font-family: Cantarell, 'Noto Sans', system-ui, sans-serif;
  font-size: 0.78rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hb-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  cursor: default;
  padding: 0;
  transition: background 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    display: block;
  }
}

.hb-min-btn,
.hb-max-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  cursor: default;
  padding: 0;
  transition:
    background 0.1s,
    color 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }

  svg {
    display: block;
  }
}

.hb-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  cursor: default;
  padding: 0;
  margin-left: 2px;
  transition:
    background 0.1s,
    color 0.1s;

  &:hover {
    background: #c01c28;
    color: #fff;
  }

  svg {
    display: block;
  }
}

.tui-caption {
  font-family: Cantarell, 'Noto Sans', system-ui, sans-serif;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  padding: 10px 16px 8px;
  margin: 0;
  background: #1d1d20;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
