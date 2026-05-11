<script setup lang="ts">
import {
  IconGnome,
  IconLayers,
  IconShieldCheck,
  IconSourceBranch,
} from '@iconify-prerendered/vue-mdi'
</script>

<template>
  <section class="section-wrap dakota-highlights">
    <div class="container">
      <div class="scene-content visible">
        <div>
          <div>
            <div class="brand-grid">
              <!-- GNOME: full-width hero item -->
              <div class="brand-item brand-gnome">
                <div>
                  <div class="icon-wrap">
                    <IconGnome />
                  </div>
                  <span class="brand-title">GNOME OS</span>
                </div>
                <p>The latest stable release of GNOME, no delays</p>
              </div>

              <!-- Right: uutils-coreutils + sudo-rs -->
              <div class="brand-item">
                <div>
                  <div class="icon-wrap">
                    <IconShieldCheck />
                  </div>
                  <span class="brand-title">Modern Userspace</span>
                </div>
                <p>uutils, systemd-boot, and legacy-free</p>
              </div>

              <!-- Left: primary — freedesktop-sdk -->
              <div class="brand-item brand-primary">
                <div>
                  <div class="icon-wrap">
                    <IconLayers />
                  </div>
                  <span class="brand-title">Freedesktop SDK</span>
                </div>
                <p>Same battle tested libraries used as Flathub. Continuously upgraded, always the up to date.</p>
              </div>

              <!-- Right: BuildStream 2 -->
              <div class="brand-item">
                <div>
                  <div class="icon-wrap">
                    <IconSourceBranch />
                  </div>
                  <span class="brand-title">BuildStream 2</span>
                </div>
                <p>Hermetic sandbox builds, reproducible and fully auditable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.dakota-highlights {
  min-height: auto;
  padding: 0;

  .icon-wrap {
    svg {
      display: block;
      height: 24px;
      width: 24px;
      color: var(--color-text-light);
    }
  }

  :deep(.brand-item) {
    padding: 14px 20px;
  }

  :deep(.brand-gnome) {
    grid-column: 1 / -1;
    border-right: none;

    .icon-wrap svg {
      height: 48px;
      width: 48px;
    }

    p {
      font-size: 2rem !important;
      font-weight: 400;
    }
  }

  :deep(.brand-primary) {
    .icon-wrap svg {
      height: 36px;
      width: 36px;
    }

    p {
      font-size: 1.8rem !important;
      font-weight: 400;
    }
  }

  :deep(.brand-title) {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-text-light);
    align-self: center;
  }

  :deep(.brand-grid) {
    margin-bottom: 0;
  }
}
</style>
