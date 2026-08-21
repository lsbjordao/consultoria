import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import type { BackgroundJourney } from './background';
import type { PhaseSceneManager } from './phaseScenes';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export function setupScroll(background: BackgroundJourney | null, scenes: PhaseSceneManager | null) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 720;

  const smoother = reduced || isTouchDevice ? null : ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.1,
    effects: true,
    smoothTouch: 0.08,
    normalizeScroll: { allowNestedScroll: true }
  });

  document.querySelectorAll<HTMLElement>('[data-scroll-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      if (smoother) smoother.scrollTo(target, true, 'top 88px');
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('[data-hero-reveal]', { y: 34, opacity: 0, duration: .85, stagger: .09 })
    .from('.hero-orbit-frame', { scale: .82, opacity: 0, rotate: -5, duration: 1.1 }, '-=.7')
    .from('.orbit-label', { scale: .8, opacity: 0, stagger: .08, duration: .55 }, '-=.65');

  gsap.to('.scroll-line i', {
    x: 76,
    duration: 1.5,
    repeat: -1,
    ease: 'power1.inOut'
  });

  gsap.to('.hero-orbit-frame', {
    rotate: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-hero]',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.from('.section-heading > *', {
    y: 32,
    opacity: 0,
    stagger: .08,
    duration: .8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '[data-method]', start: 'top 76%' }
  });

  gsap.to('[data-method-line]', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-method-rail]',
      start: 'top 76%',
      end: 'bottom 36%',
      scrub: 1
    }
  });

  gsap.from('[data-method-step]', {
    opacity: 0,
    scale: .98,
    stagger: .04,
    duration: .45,
    ease: 'power2.out',
    scrollTrigger: { trigger: '[data-method-rail]', start: 'top 72%' }
  });

  gsap.from('[data-feedback-note]', {
    y: 24,
    opacity: 0,
    duration: .7,
    scrollTrigger: { trigger: '[data-feedback-note]', start: 'top 84%' }
  });

  const phases = Array.from(document.querySelectorAll<HTMLElement>('[data-phase]'));
  phases.forEach((phase, index) => {
    const copy = phase.querySelector('[data-phase-copy]');
    const visual = phase.querySelector<HTMLElement>('.phase-visual-shell');
    const deliverables = phase.querySelectorAll('[data-deliverable]');
    const progressEl = phase.querySelector<HTMLElement>('[data-phase-progress]');

    const intro = gsap.timeline({
      scrollTrigger: { trigger: phase, start: 'top 72%', toggleActions: 'play none none reverse' }
    });
    intro
      .from(copy, { y: 36, opacity: 0, duration: .75, ease: 'power3.out' })
      .from(visual, { y: 24, scale: .96, opacity: 0, duration: .75, ease: 'power3.out' }, '-=.55')
      .from(deliverables, { y: 16, opacity: 0, stagger: .08, duration: .45, ease: 'power2.out' }, '-=.35');

    if (visual && innerWidth > 1050 && !reduced) {
      ScrollTrigger.create({
        trigger: phase,
        start: 'top 110px',
        end: 'bottom 86%',
        pin: visual,
        pinSpacing: true,
        anticipatePin: 1
      });
    }

    ScrollTrigger.create({
      trigger: phase,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate(self) {
        scenes?.setProgress(index, self.progress);
        if (progressEl) progressEl.textContent = `${Math.round(self.progress * 100).toString().padStart(2, '0')}%`;
      }
    });

    gsap.to(phase.querySelector('.phase-canvas'), {
      yPercent: -4,
      ease: 'none',
      scrollTrigger: { trigger: phase, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
    });
  });

  const progressDots = Array.from(document.querySelectorAll<HTMLElement>('[data-progress-dot]'));
  const stageTargets = [document.querySelector('#inicio'), ...phases].filter(Boolean) as HTMLElement[];
  stageTargets.forEach((target, index) => {
    ScrollTrigger.create({
      trigger: target,
      start: 'top 52%',
      end: 'bottom 52%',
      onToggle(self) {
        if (!self.isActive) return;
        progressDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
      }
    });
  });
  progressDots[0]?.classList.add('is-active');

  ScrollTrigger.create({
    trigger: '#smooth-content',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      background?.setProgress(self.progress);
    }
  });

  gsap.from('[data-final] .final-card', {
    y: 42,
    scale: .97,
    opacity: 0,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '[data-final]', start: 'top 75%' }
  });

  const glow = document.querySelector<HTMLElement>('.cursor-glow');
  if (glow && !reduced) {
    const xTo = gsap.quickTo(glow, 'x', { duration: .65, ease: 'power3.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: .65, ease: 'power3.out' });
    window.addEventListener('pointermove', (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
    }, { passive: true });
  }

  ScrollTrigger.refresh();
  return { smoother };
}
