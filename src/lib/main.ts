import { BackgroundJourney } from './background';
import { PhaseSceneManager } from './phaseScenes';
import { setupScroll } from './scroll';

function boot() {
  const canvas = document.querySelector<HTMLCanvasElement>('#journey-webgl');
  const background = canvas ? new BackgroundJourney(canvas) : null;
  const scenes = document.querySelector('[data-phase-canvas]') ? new PhaseSceneManager() : null;
  setupScroll(background, scenes);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
