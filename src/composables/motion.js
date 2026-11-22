import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// a template ref inside v-for is an array: take its element
const elementOf = (target) => (Array.isArray(target.value) ? target.value[0] : target.value) ?? null;

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// true once the element has come into view (stays true). Reduced motion: true at once.
export function useInView(target, { threshold = 0.25, rootMargin = '0px 0px -10% 0px' } = {}) {
  const inView = ref(false);
  let io;
  onMounted(() => {
    const el = elementOf(target);
    if (!el || prefersReducedMotion() || typeof IntersectionObserver !== 'function') { inView.value = true; return; }
    io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { inView.value = true; io.disconnect(); }
    }, { threshold, rootMargin });
    io.observe(el);
  });
  onBeforeUnmount(() => io?.disconnect());
  return inView;
}

// 0 to 1 as the element travels from `start` (its top at that share of the viewport)
// until its bottom reaches `end`. Reduced motion: 1.
export function useScrollProgress(target, { start = 0.85, end = 0.5 } = {}) {
  const progress = ref(0);
  let frame = 0;
  const measure = () => {
    frame = 0;
    const el = elementOf(target);
    if (!el) return;
    const vh = innerHeight;
    const r = el.getBoundingClientRect();
    const span = (start - end) * vh + r.height;
    progress.value = Math.min(1, Math.max(0, (start * vh - r.top) / span));
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
  onMounted(() => {
    if (prefersReducedMotion()) { progress.value = 1; return; }
    measure();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
  });
  onBeforeUnmount(() => {
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    cancelAnimationFrame(frame);
  });
  return progress;
}

// A number that runs from `from` to `to` once `run` turns true (ease-out). Reduced motion: `to` at once.
export function useCountUp(run, from, to, duration = 1400) {
  const shown = ref(prefersReducedMotion() ? to : from);
  watch(run, (go) => {
    if (!go || prefersReducedMotion()) { if (go) shown.value = to; return; }
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      shown.value = Math.round(from + (to - from) * eased);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { immediate: true });
  return shown;
}

// the element's width in px, kept current (charts draw at real size, so their text stays legible)
export function useElementWidth(target, fallback = 640) {
  const width = ref(fallback);
  let ro;
  onMounted(() => {
    const el = elementOf(target);
    if (!el) return;
    width.value = el.clientWidth || fallback;
    if (typeof ResizeObserver !== 'function') return;
    ro = new ResizeObserver(([entry]) => { width.value = Math.round(entry.contentRect.width) || fallback; });
    ro.observe(el);
  });
  onBeforeUnmount(() => ro?.disconnect());
  return width;
}
