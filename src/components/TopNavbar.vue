<script setup lang="ts">
import type { Component, WritableComputedRef } from 'vue'
import type { MessageSchema } from '../locales/schema'
import {
  IconCodeBraces,
  IconDownload,
  IconFaceManShimmer,
} from '@iconify-prerendered/vue-mdi'
import { inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n<MessageSchema>({
  useScope: 'global',
})

// External links
const externalLinks = [
  {
    name: t('TopBar.Docs'),
    href: 'https://docs.projectbluefin.io/introduction',
  },
  { name: t('TopBar.AskBluefin'), href: 'https://ask.projectbluefin.io', external: true },
  { name: t('TopBar.Blog'), href: 'https://docs.projectbluefin.io/blog' },
  { name: t('TopBar.Changelog'), href: 'https://docs.projectbluefin.io/changelogs' },
  { name: t('TopBar.Reports'), href: 'https://docs.projectbluefin.io/reports' },
  {
    name: t('TopBar.Discussions'),
    href: 'https://github.com/ublue-os/bluefin/discussions',
    external: true,
  },
  {
    name: t('TopBar.Feedback'),
    href: 'https://feedback.projectbluefin.io/',
    external: true,
  },
  {
    name: t('TopBar.Store'),
    href: 'https://store.projectbluefin.io',
    external: true,
  },
]

// Section navigation links
interface SectionLink {
  name: string
  icon?: Component
}

const sectionLinks: Record<string, SectionLink> = {
  '#scene-users': { name: 'Navbar.ForYou', icon: IconFaceManShimmer },
  '#scene-developers': { name: 'Navbar.ForDevs', icon: IconCodeBraces },
  '#scene-mission': { name: 'Navbar.OurMission' },
  '#scene-picker': { name: 'Navbar.TryOut', icon: IconDownload },
  '#scene-community': { name: 'Navbar.Community' },
}

const visibleSection = inject('visibleSection') as WritableComputedRef<string>
const offset = ref<number>(0)
const linksAmount = Object.keys(sectionLinks).length

function scrollTo(id: string) {
  const el = document.querySelector(id)
  el?.scrollIntoView({ behavior: 'smooth' })
}

watch(
  visibleSection,
  (section: string) => {
    if (!section) {
      return
    }
    const el = document.querySelector(`[data-section="${section}"]`)
    if (el) {
      offset.value = Array.from(el.parentElement?.childNodes ?? []).indexOf(el)
    }
  },
  { immediate: true },
)
</script>

<template>
  <nav class="unified-navbar" role="navigation" aria-label="Main navigation">
    <!-- Top row: brand + external links -->
    <div class="navbar-top">
      <a href="https://projectbluefin.io" class="navbar-brand">
        <img src="/img/logo.svg" alt="Bluefin" loading="eager" class="navbar-logo">
        <b class="navbar-title">Bluefin</b>
      </a>

      <div class="navbar-links">
        <a
          v-for="link in externalLinks"
          :key="link.name"
          :href="link.href"
          class="navbar-link"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          {{ link.name }}
        </a>
      </div>
    </div>

    <!-- Bottom row: section navigation -->
    <div class="navbar-sections">
      <ul
        :style="{
          gridTemplateColumns: `repeat(${linksAmount}, 1fr)`,
        }"
      >
        <li v-for="(link, key) in sectionLinks" :key="key" :data-section="key">
          <a
            :href="key"
            :class="{ active: key === visibleSection }"
            :aria-label="`Section ${t(link.name)}`"
            @click.prevent="scrollTo(key)"
          >
            <component :is="link.icon" v-if="link.icon" />
            {{ t(link.name) }}
          </a>
        </li>

        <div
          class="section-indicator"
          :style="{
            left: `${Math.max(0, (offset - 1) * (100 / linksAmount))}%`,
            opacity: !visibleSection ? 0 : 1,
            width: `${Math.round(100 / linksAmount)}%`,
          }"
        />
      </ul>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.unified-navbar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: clamp(320px, 85%, 1200px);
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  background-color: rgba(var(--color-bg-rgb), 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  // Subtle glow
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;

  // Entry animation
  animation: navbar-slide-in 0.8s cubic-bezier(0.85, 0, 0.15, 1) forwards;

  @keyframes navbar-slide-in {
    from {
      top: -100px;
      opacity: 0;
    }
    to {
      top: 16px;
      opacity: 1;
    }
  }

  // Better text rendering
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.navbar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid var(--color-blue-light);
    outline-offset: 2px;
    border-radius: 4px;
  }
}

.navbar-logo {
  height: 28px;
  width: auto;
  display: block;
}

.navbar-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-light);
  line-height: 1;
  white-space: nowrap;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

.navbar-link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-text-light);
    background-color: rgba(var(--color-blue-rgb), 0.15);
  }

  &:focus-visible {
    outline: 2px solid var(--color-blue-light);
    outline-offset: 2px;
  }
}

.navbar-sections {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 8px;

  ul {
    display: grid;
    gap: 0;
    width: 100%;
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    z-index: 5;
    width: 100%;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      height: 36px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--color-text);
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.76, 0, 0.24, 1);
      letter-spacing: 0.02em;

      svg {
        pointer-events: none;
        font-size: 16px;
        color: var(--color-text);
        transition: color 0.2s ease;
      }

      &:hover,
      &.active {
        color: var(--color-text-light);

        svg {
          color: var(--color-text-light);
        }
      }
    }
  }

  .section-indicator {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-radius: 12px;
    background-color: rgba(var(--color-blue-rgb), 0.2);
    z-index: -1;
    transition: all 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }
}

// Tablet
@media (max-width: 996px) {
  .unified-navbar {
    width: clamp(320px, 92%, 800px);
    padding: 10px 16px;
  }

  .navbar-link {
    font-size: 12px;
    padding: 4px 8px;
  }

  .navbar-sections li a {
    font-size: 11px;
    height: 32px;
  }
}

// Mobile
@media (max-width: 768px) {
  .unified-navbar {
    width: calc(100% - 24px);
    top: 12px;
    padding: 10px 14px;
    border-radius: 16px;

    @keyframes navbar-slide-in {
      from {
        top: -100px;
        opacity: 0;
      }
      to {
        top: 12px;
        opacity: 1;
      }
    }
  }

  .navbar-top {
    flex-wrap: wrap;
  }

  .navbar-links {
    display: none;
  }

  .navbar-sections li a {
    font-size: 10px;
    height: 30px;
    gap: 4px;

    svg {
      font-size: 14px;
    }
  }
}
</style>
