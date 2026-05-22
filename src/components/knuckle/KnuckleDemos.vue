<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL

const phase = ref<'channels' | 'update' | 'dashboard'>('channels')
let timer: ReturnType<typeof setTimeout>
const sequence: Array<{ phase: 'channels' | 'update' | 'dashboard', duration: number }> = [
  { phase: 'channels', duration: 12000 },
  { phase: 'update', duration: 8000 },
  { phase: 'dashboard', duration: 10000 },
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
</script>

<template>
  <section class="knuckle-demos">
    <div class="demo-window">
      <!-- Adw.HeaderBar -->
      <div class="adw-header-bar">
        <!-- [start]: new tab split button -->
        <div class="hb-start">
          <button class="hb-icon-btn" aria-label="New Tab" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <!-- center: Adw.WindowTitle -->
        <div class="hb-title">
          <span class="hb-title-text">bluespeed</span>
          <span class="hb-subtitle-text">{{ phase === 'channels' ? 'channels' : phase === 'update' ? 'update strategy' : 'dashboard' }}</span>
        </div>
        <!-- [end]: grid + menu + close -->
        <div class="hb-end">
          <button class="hb-icon-btn" aria-label="View Tabs" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.8" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.8" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.8" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.8" />
            </svg>
          </button>
          <button class="hb-icon-btn" aria-label="Menu" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="3.5" r="1.2" fill="currentColor" opacity="0.8" />
              <circle cx="8" cy="8" r="1.2" fill="currentColor" opacity="0.8" />
              <circle cx="8" cy="12.5" r="1.2" fill="currentColor" opacity="0.8" />
            </svg>
          </button>
          <!-- window close button (GNOME default: close only, right side) -->
          <button class="hb-close-btn" aria-label="Close" tabindex="-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Adw.TabBar — removed -->
      <transition name="fade" mode="out-in">
        <img
          v-if="phase === 'channels'"
          key="channels"
          :src="`${baseUrl}knuckle-channels.gif`"
          alt="Knuckle channel selector showing Stable, LTS, Beta, Alpha"
        >
        <img
          v-else-if="phase === 'update'"
          key="update"
          :src="`${baseUrl}knuckle-update.gif`"
          alt="Knuckle update strategy configuration"
        >
        <img
          v-else
          key="dashboard"
          :src="`${baseUrl}kubestellar-dashboard.png`"
          alt="KubeStellar dashboard"
        >
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

/* Adw.HeaderBar */
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

/* Adw window close button — circular, right side */
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

/* Adw.TabBar — removed */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
