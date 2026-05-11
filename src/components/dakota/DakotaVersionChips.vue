<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface DakotaVersions {
  generatedAt: string
  packages: Record<string, string>
}

const LABELS: Record<string, string> = {
  baseline: 'x86-64',
  kernel: 'Kernel',
  gnome: 'GNOME',
  mesa: 'Mesa',
  bootc: 'bootc',
  nvidia: 'Nvidia',
  systemd: 'systemd',
  podman: 'Podman',
  pipewire: 'PipeWire',
  flatpak: 'Flatpak',
}

const versions = ref<DakotaVersions | null>(null)

onMounted(async () => {
  try {
    const res = await fetch('/dakota-versions.json')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    versions.value = await res.json()
  }
  catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[DakotaVersionChips] failed to load versions', e)
    }
  }
})

const chips = computed(() => {
  if (!versions.value) {
    return []
  }
  return Object.entries(versions.value.packages)
    .filter(([, v]) => v)
    .map(([key, value]) => ({ label: LABELS[key] ?? key, value }))
})
</script>

<template>
  <div v-if="chips.length" class="version-chips">
    <span
      v-for="chip in chips"
      :key="chip.label"
      class="version-chip"
    >
      <span class="chip-label">{{ chip.label }}</span>
      <span class="chip-value">{{ chip.value }}</span>
    </span>
  </div>
</template>

<style scoped lang="scss">
.version-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.version-chip {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  overflow: hidden;
  font-size: 1.2rem;
  line-height: 1;
}

.chip-label {
  background: transparent;
  color: var(--color-text);
  padding: 5px 8px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.chip-value {
  background: rgba(var(--color-blue-rgb), 0.2);
  color: var(--color-text-light);
  padding: 5px 8px;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  font-size: 1.2rem;
}

@media (max-width: 500px) {
  .version-chips {
    gap: 6px;
  }

  .version-chip {
    font-size: 1.1rem;
  }

  .chip-label,
  .chip-value {
    padding: 4px 6px;
  }
}
</style>
