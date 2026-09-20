"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_LENIS_OPTIONS: () => DEFAULT_LENIS_OPTIONS,
  DISTANCE: () => DISTANCE,
  DURATION: () => DURATION,
  EASING: () => EASING,
  PageTransitionProvider: () => PageTransitionProvider,
  STAGGER: () => STAGGER,
  ScrollTrigger: () => import_ScrollTrigger.ScrollTrigger,
  SmoothScrollProvider: () => SmoothScrollProvider,
  SplitText: () => import_SplitText.SplitText,
  TRANSITION_DEFAULTS: () => TRANSITION_DEFAULTS,
  TransitionLink: () => TransitionLink,
  batchReveal: () => batchReveal,
  configureMotion: () => configureMotion,
  connectScrollTrigger: () => connectScrollTrigger,
  createScrollAnimation: () => createScrollAnimation,
  createSmoothScroll: () => createSmoothScroll,
  ensureRegistered: () => ensureRegistered,
  fadeIn: () => fadeIn,
  fadeOut: () => fadeOut,
  getLenis: () => getLenis,
  getMotionConfig: () => getMotionConfig,
  getPageScrollProgress: () => getPageScrollProgress,
  gsap: () => import_gsap.gsap,
  imageReveal: () => imageReveal,
  imageZoom: () => imageZoom,
  isBrowser: () => isBrowser,
  killScrollTriggers: () => killScrollTriggers,
  parallax: () => parallax,
  pinSection: () => pinSection,
  prefersReducedMotion: () => prefersReducedMotion,
  refreshScrollTriggers: () => refreshScrollTriggers,
  resetMotionConfig: () => resetMotionConfig,
  reveal: () => reveal,
  scaleImage: () => scaleImage,
  scrollTo: () => scrollTo,
  splitTextAnimation: () => splitTextAnimation,
  subscribeToReducedMotion: () => subscribeToReducedMotion,
  textReveal: () => textReveal,
  useGSAP: () => import_react.useGSAP,
  useGSAPAnimation: () => useGSAPAnimation,
  useLenis: () => useLenis,
  useLenisScroll: () => useLenisScroll,
  usePageScrollProgress: () => usePageScrollProgress,
  useParallax: () => useParallax,
  useReducedMotion: () => useReducedMotion,
  useScrollProgress: () => useScrollProgress,
  useScrollTo: () => useScrollTo,
  useTransitionRouter: () => useTransitionRouter,
  watchPageScrollProgress: () => watchPageScrollProgress,
  watchScrollProgress: () => watchScrollProgress
});
module.exports = __toCommonJS(index_exports);

// src/core/config.ts
var DURATION = {
  /** Micro-interactions: hovers, button states, cursor feedback. */
  fast: 0.4,
  /** The default. Most UI transitions. */
  base: 0.8,
  /** Deliberate, weighty moves. Section changes. */
  slow: 1.2,
  /** Hero and headline entrances. The slowest thing on the site. */
  reveal: 1.6
};
var EASING = {
  /** Gentle settle. Safe default for small UI moves. */
  soft: "power2.out",
  /** The signature curve: fast departure, long graceful arrival. */
  premium: "expo.out",
  /** Heavy, cinematic. Full-section and pinned transitions. */
  dramatic: "power4.inOut",
  /** Symmetrical. Loops and continuous motion. */
  smooth: "power1.inOut",
  /**
   * Linear. Required for anything driven by `scrub` — any other curve breaks
   * the 1:1 mapping between scroll position and animation progress.
   */
  none: "none"
};
var STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.16
};
var DISTANCE = {
  sm: 24,
  md: 48,
  lg: 96
};
var defaultConfig = {
  respectReducedMotion: true,
  markers: false,
  defaultDuration: DURATION.base,
  defaultEase: EASING.premium
};
var config = { ...defaultConfig };
function configureMotion(overrides) {
  config = { ...config, ...overrides };
}
function getMotionConfig() {
  return config;
}
function resetMotionConfig() {
  config = { ...defaultConfig };
}

// src/core/gsap.ts
var import_react = require("@gsap/react");
var import_gsap = require("gsap");
var import_ScrollTrigger = require("gsap/ScrollTrigger");
var import_SplitText = require("gsap/SplitText");

// src/core/env.ts
var REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
var isProduction = process.env.NODE_ENV === "production";
function prefersReducedMotion() {
  if (!isBrowser) return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
function subscribeToReducedMotion(onChange) {
  if (!isBrowser) return () => {
  };
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// src/core/gsap.ts
var registered = false;
function ensureRegistered() {
  if (registered || !isBrowser) return;
  registered = true;
  import_gsap.gsap.registerPlugin(import_react.useGSAP, import_ScrollTrigger.ScrollTrigger, import_SplitText.SplitText);
  const { defaultDuration, defaultEase } = getMotionConfig();
  import_gsap.gsap.defaults({ duration: defaultDuration, ease: defaultEase });
  import_gsap.gsap.config({
    // "auto" GPU-promotes only while a tween runs, so long-lived compositing
    // layers don't leave text blurry after it settles.
    force3D: "auto",
    nullTargetWarn: process.env.NODE_ENV !== "production"
  });
  import_ScrollTrigger.ScrollTrigger.config({
    // Mobile browsers fire resize when the URL bar hides. Refreshing there
    // makes pinned sections jump mid-scroll.
    ignoreMobileResize: true
  });
}

// src/core/lenis.ts
var import_lenis = __toESM(require("lenis"), 1);
var DEFAULT_LAG_SMOOTHING = [500, 33];
var DEFAULT_LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  // Touch devices already have momentum scrolling. Overriding it reads as lag.
  syncTouch: false,
  // GSAP's ticker drives the loop instead — see connectScrollTrigger().
  autoRaf: false
};
var activeLenis = null;
function createSmoothScroll(options = {}) {
  if (!isBrowser) return null;
  ensureRegistered();
  return new import_lenis.default({ ...DEFAULT_LENIS_OPTIONS, ...options });
}
function connectScrollTrigger(lenis) {
  ensureRegistered();
  const onScroll = () => import_ScrollTrigger.ScrollTrigger.update();
  lenis.on("scroll", onScroll);
  const raf = (time) => lenis.raf(time * 1e3);
  import_gsap.gsap.ticker.add(raf);
  import_gsap.gsap.ticker.lagSmoothing(0);
  import_ScrollTrigger.ScrollTrigger.refresh();
  return () => {
    lenis.off("scroll", onScroll);
    import_gsap.gsap.ticker.remove(raf);
    import_gsap.gsap.ticker.lagSmoothing(...DEFAULT_LAG_SMOOTHING);
  };
}
function setActiveLenis(lenis) {
  activeLenis = lenis;
}
function getLenis() {
  return activeLenis;
}
function scrollTo(target, options = {}) {
  if (!isBrowser) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options.offset ?? 0,
      duration: options.duration,
      immediate: options.immediate,
      onComplete: options.onComplete
    });
    return;
  }
  const offset = options.offset ?? 0;
  let top;
  if (typeof target === "number") {
    top = target + offset;
  } else {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    top = element.getBoundingClientRect().top + window.scrollY + offset;
  }
  window.scrollTo({
    top,
    behavior: options.immediate ? "auto" : "smooth"
  });
  options.onComplete?.();
}

// src/core/target.ts
function isRef(value) {
  return "current" in value;
}
function resolveTarget(target) {
  if (target === null || target === void 0) return null;
  if (typeof target === "string") return target;
  if (target instanceof Element) return target;
  if (Array.isArray(target)) return target.length > 0 ? target : null;
  if (isRef(target)) return target.current;
  return target.length > 0 ? Array.from(target) : null;
}
function resolveElements(target) {
  const resolved = resolveTarget(target);
  if (resolved === null) return [];
  if (typeof resolved === "string") {
    return Array.from(document.querySelectorAll(resolved));
  }
  if (resolved instanceof Element) return [resolved];
  if (Array.isArray(resolved)) {
    return resolved.filter((item) => item instanceof Element);
  }
  return [];
}

// src/core/vars.ts
function isMotionSuppressed() {
  return getMotionConfig().respectReducedMotion && prefersReducedMotion();
}
function shouldSkipDecorativeMotion() {
  return isMotionSuppressed();
}
function resolveTimings(options = {}, fallbacks = {}) {
  const config2 = getMotionConfig();
  if (isMotionSuppressed()) {
    return { duration: 0, delay: 0, stagger: 0, ease: "none" };
  }
  return {
    duration: options.duration ?? fallbacks.duration ?? config2.defaultDuration,
    delay: options.delay ?? fallbacks.delay ?? 0,
    ease: options.ease ?? fallbacks.ease ?? config2.defaultEase,
    stagger: options.stagger ?? fallbacks.stagger ?? 0
  };
}
function toScrollTriggerVars(scroll, defaults = {}) {
  if (!scroll) return void 0;
  const options = scroll === true ? {} : scroll;
  const merged = { ...defaults, ...options };
  const vars = {
    start: merged.start ?? "top 80%",
    end: merged.end ?? "bottom 20%"
  };
  const trigger = resolveTarget(merged.trigger);
  if (trigger) vars.trigger = trigger;
  if (merged.scrub !== void 0 && !isMotionSuppressed()) {
    vars.scrub = merged.scrub;
  }
  if (merged.pin !== void 0 && merged.pin !== false) {
    vars.pin = merged.pin === true ? true : resolveTarget(merged.pin);
  }
  if (merged.pinSpacing !== void 0) vars.pinSpacing = merged.pinSpacing;
  if (merged.toggleActions !== void 0 && vars.scrub === void 0) {
    vars.toggleActions = merged.toggleActions;
  }
  if (merged.once !== void 0) vars.once = merged.once;
  if (merged.refreshPriority !== void 0) {
    vars.refreshPriority = merged.refreshPriority;
  }
  if (merged.id !== void 0) vars.id = merged.id;
  const wantsMarkers = merged.markers ?? getMotionConfig().markers;
  if (wantsMarkers && !isProduction) vars.markers = true;
  if (merged.onEnter) vars.onEnter = merged.onEnter;
  if (merged.onLeave) vars.onLeave = merged.onLeave;
  if (merged.onEnterBack) vars.onEnterBack = merged.onEnterBack;
  if (merged.onLeaveBack) vars.onLeaveBack = merged.onLeaveBack;
  if (merged.onUpdate) {
    const onUpdate = merged.onUpdate;
    vars.onUpdate = (self) => {
      onUpdate(self.progress, self.direction);
    };
  }
  return vars;
}

// src/animations/fade.ts
function fadeIn(target, options = {}) {
  if (!isBrowser) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  const { duration, delay, ease, stagger } = resolveTimings(options, {
    duration: DURATION.base,
    ease: EASING.premium
  });
  return import_gsap.gsap.fromTo(
    resolved,
    { autoAlpha: options.opacity ?? 0 },
    {
      autoAlpha: 1,
      duration,
      delay,
      ease,
      stagger,
      onStart: options.onStart,
      onComplete: options.onComplete,
      scrollTrigger: toScrollTriggerVars(options.scroll, { trigger: target })
    }
  );
}
function fadeOut(target, options = {}) {
  if (!isBrowser) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  const { duration, delay, ease, stagger } = resolveTimings(options, {
    duration: DURATION.fast,
    ease: EASING.soft
  });
  return import_gsap.gsap.to(resolved, {
    autoAlpha: options.opacity ?? 0,
    duration,
    delay,
    ease,
    stagger,
    onStart: options.onStart,
    onComplete: options.onComplete,
    scrollTrigger: toScrollTriggerVars(options.scroll, { trigger: target })
  });
}

// src/animations/reveal.ts
function offsetFor(direction = "up", distance) {
  switch (direction) {
    case "down":
      return { axis: "y", offset: -distance };
    case "left":
      return { axis: "x", offset: distance };
    case "right":
      return { axis: "x", offset: -distance };
    case "none":
      return { axis: "y", offset: 0 };
    case "up":
    default:
      return { axis: "y", offset: distance };
  }
}
function reveal(target, options = {}) {
  if (!isBrowser) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  const { axis, offset } = offsetFor(
    options.direction,
    options.distance ?? DISTANCE.md
  );
  const { duration, delay, ease, stagger } = resolveTimings(options, {
    duration: DURATION.reveal,
    ease: EASING.premium,
    stagger: STAGGER.base
  });
  return import_gsap.gsap.fromTo(
    resolved,
    { autoAlpha: options.from ?? 0, [axis]: offset },
    {
      autoAlpha: 1,
      [axis]: 0,
      duration,
      delay,
      ease,
      stagger,
      onStart: options.onStart,
      onComplete: options.onComplete,
      scrollTrigger: toScrollTriggerVars(options.scroll, {
        trigger: target,
        start: "top 85%"
      })
    }
  );
}
function textReveal(target, options = {}) {
  if (!isBrowser) return () => {
  };
  ensureRegistered();
  const elements = resolveElements(target);
  if (elements.length === 0) return () => {
  };
  const {
    split = "lines",
    distance = 100,
    mask = true,
    scroll
  } = options;
  const { duration, delay, ease, stagger } = resolveTimings(options, {
    duration: DURATION.reveal,
    ease: EASING.premium,
    stagger: split === "chars" ? STAGGER.tight : STAGGER.base
  });
  let instance = null;
  let cancelled = false;
  const type = split === "lines" ? "lines,words" : split;
  const build = () => {
    if (cancelled) return;
    instance = import_SplitText.SplitText.create(elements, {
      type,
      ...mask ? { mask: split } : {},
      autoSplit: split === "lines",
      onSplit(self) {
        const units = split === "chars" ? self.chars : split === "words" ? self.words : self.lines;
        if (!units || units.length === 0) return;
        return import_gsap.gsap.from(units, {
          yPercent: isMotionSuppressed() ? 0 : distance,
          autoAlpha: 0,
          duration,
          delay,
          ease,
          stagger,
          onComplete: options.onComplete,
          scrollTrigger: toScrollTriggerVars(scroll, {
            trigger: target,
            start: "top 85%"
          })
        });
      }
    });
  };
  if (typeof document !== "undefined" && "fonts" in document) {
    void document.fonts.ready.then(build);
  } else {
    build();
  }
  return () => {
    cancelled = true;
    instance?.revert();
    instance = null;
  };
}
var splitTextAnimation = textReveal;

// src/animations/parallax.ts
function parallax(target, options = {}) {
  if (!isBrowser) return null;
  if (shouldSkipDecorativeMotion()) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  const { speed = 0.2, axis = "y", scroll } = options;
  const property = axis === "x" ? "xPercent" : "yPercent";
  const travel = speed * 100;
  return import_gsap.gsap.fromTo(
    resolved,
    { [property]: -travel / 2 },
    {
      [property]: travel / 2,
      // Scrubbed animation must be linear or scroll and position desynchronise.
      ease: EASING.none,
      scrollTrigger: toScrollTriggerVars(scroll ?? true, {
        trigger: target,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      })
    }
  );
}

// src/animations/scale.ts
function scaleImage(target, options = {}) {
  if (!isBrowser) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  const { duration, delay, ease, stagger } = resolveTimings(options, {
    duration: DURATION.reveal,
    ease: EASING.premium
  });
  return import_gsap.gsap.fromTo(
    resolved,
    { scale: options.from ?? 1.15, autoAlpha: 0 },
    {
      scale: options.to ?? 1,
      autoAlpha: 1,
      duration,
      delay,
      ease,
      stagger,
      // Scaling a raster image forces the compositor to resample it every
      // frame; a explicit hint keeps it on one texture for the tween.
      force3D: true,
      onStart: options.onStart,
      onComplete: options.onComplete,
      scrollTrigger: toScrollTriggerVars(options.scroll, {
        trigger: target,
        start: "top 85%"
      })
    }
  );
}

// src/animations/image.ts
function imageZoom(target, options = {}) {
  if (!isBrowser) return null;
  if (shouldSkipDecorativeMotion()) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  return import_gsap.gsap.fromTo(
    resolved,
    { scale: options.from ?? 1 },
    {
      scale: options.to ?? 1.2,
      ease: EASING.none,
      force3D: true,
      scrollTrigger: toScrollTriggerVars(options.scroll ?? true, {
        trigger: target,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      })
    }
  );
}
var CLIP_CLOSED = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)"
};
function imageReveal(target, options = {}) {
  if (!isBrowser) return null;
  ensureRegistered();
  const resolved = resolveTarget(target);
  if (!resolved) return null;
  const { duration, delay, ease } = resolveTimings(options, {
    duration: DURATION.reveal,
    ease: EASING.dramatic
  });
  const closed = CLIP_CLOSED[options.direction ?? "bottom"] ?? CLIP_CLOSED.bottom;
  const timeline = import_gsap.gsap.timeline({
    delay,
    onStart: options.onStart,
    onComplete: options.onComplete,
    scrollTrigger: toScrollTriggerVars(options.scroll, {
      trigger: target,
      start: "top 85%"
    })
  });
  timeline.fromTo(
    resolved,
    { clipPath: closed },
    { clipPath: "inset(0% 0% 0% 0%)", duration, ease }
  ).fromTo(
    resolved,
    { scale: options.scale ?? 1.15 },
    { scale: 1, duration, ease, force3D: true },
    // Start with the wipe so the two read as one gesture.
    "<"
  );
  return timeline;
}

// src/animations/pin.ts
function pinSection(target, options = {}) {
  if (!isBrowser) return null;
  if (isMotionSuppressed()) return null;
  ensureRegistered();
  const trigger = resolveTarget(target);
  if (!trigger) return null;
  const vars = toScrollTriggerVars(
    {
      trigger: target,
      start: options.start ?? "top top",
      end: options.end ?? "+=100%",
      pin: options.pin ?? true,
      pinSpacing: options.pinSpacing ?? true,
      scrub: options.scrub ?? true,
      markers: options.markers,
      id: options.id,
      ...options.onProgress ? { onUpdate: (progress) => options.onProgress?.(progress) } : {}
    },
    {}
  );
  if (!vars) return null;
  if (options.animation) vars.animation = options.animation;
  return import_ScrollTrigger.ScrollTrigger.create(vars);
}

// src/scroll/createScrollAnimation.ts
function createScrollAnimation(options) {
  if (!isBrowser) return null;
  ensureRegistered();
  const trigger = resolveTarget(options.trigger);
  if (!trigger) return null;
  const vars = toScrollTriggerVars({ ...options, trigger: options.trigger });
  if (!vars) return null;
  if (options.animation) vars.animation = options.animation;
  return import_ScrollTrigger.ScrollTrigger.create(vars);
}
function refreshScrollTriggers() {
  if (!isBrowser) return;
  import_ScrollTrigger.ScrollTrigger.refresh();
}
function killScrollTriggers() {
  if (!isBrowser) return;
  import_ScrollTrigger.ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
}

// src/scroll/progress.ts
function watchScrollProgress(target, onProgress, options = {}) {
  if (!isBrowser) return () => {
  };
  ensureRegistered();
  const vars = toScrollTriggerVars(
    { ...options, trigger: target, onUpdate: onProgress },
    { start: "top bottom", end: "bottom top" }
  );
  if (!vars) return () => {
  };
  vars.scrub = true;
  const instance = import_ScrollTrigger.ScrollTrigger.create(vars);
  return () => instance.kill();
}
function getPageScrollProgress() {
  if (!isBrowser) return 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}
function watchPageScrollProgress(onProgress) {
  if (!isBrowser) return () => {
  };
  ensureRegistered();
  const instance = import_ScrollTrigger.ScrollTrigger.create({
    start: 0,
    end: "max",
    scrub: true,
    onUpdate: (self) => onProgress(self.progress)
  });
  return () => instance.kill();
}

// src/scroll/batch.ts
function batchReveal(targets, options = {}) {
  if (!isBrowser) return [];
  ensureRegistered();
  const elements = resolveElements(targets);
  if (elements.length === 0) return [];
  const {
    direction = "up",
    distance = DISTANCE.md,
    from = 0,
    duration = DURATION.base,
    ease = EASING.premium,
    stagger = STAGGER.base,
    batchMax = 8,
    interval,
    reverse = false,
    start = "top 85%"
  } = options;
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "down" || direction === "right" ? -1 : 1;
  const offset = direction === "none" ? 0 : distance * sign;
  if (isMotionSuppressed()) {
    import_gsap.gsap.set(elements, { opacity: 1, x: 0, y: 0, clearProps: "transform" });
    return [];
  }
  import_gsap.gsap.set(elements, { opacity: from, [axis]: offset });
  return import_ScrollTrigger.ScrollTrigger.batch(elements, {
    start,
    batchMax,
    ...interval !== void 0 ? { interval } : {},
    onEnter: (batch) => import_gsap.gsap.to(batch, {
      opacity: 1,
      [axis]: 0,
      duration,
      ease,
      stagger,
      overwrite: true
    }),
    ...reverse ? {
      onLeaveBack: (batch) => import_gsap.gsap.to(batch, {
        opacity: from,
        [axis]: offset,
        duration: DURATION.fast,
        ease: EASING.soft,
        overwrite: true
      })
    } : {}
  });
}

// src/providers/SmoothScrollProvider.tsx
var import_lenis3 = require("lenis/dist/lenis.css");
var import_lenis4 = require("lenis");
var import_react3 = require("react");

// src/hooks/useLenis.ts
var import_react2 = require("react");
var LenisContext = (0, import_react2.createContext)(null);
function useLenis() {
  return (0, import_react2.useContext)(LenisContext);
}
function useLenisScroll(callback) {
  const lenis = useLenis();
  (0, import_react2.useEffect)(() => {
    if (!lenis) return;
    lenis.on("scroll", callback);
    return () => lenis.off("scroll", callback);
  }, [lenis, callback]);
}
function useScrollTo() {
  return (0, import_react2.useCallback)(
    (target, options) => {
      scrollTo(target, options);
    },
    []
  );
}

// src/providers/SmoothScrollProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function SmoothScrollProvider({
  children,
  options,
  disabled = false
}) {
  const [lenis, setLenis] = (0, import_react3.useState)(null);
  const optionsRef = (0, import_react3.useRef)(options);
  const reducedMotion = (0, import_react3.useSyncExternalStore)(
    subscribeToReducedMotion,
    prefersReducedMotion,
    () => false
  );
  (0, import_react3.useEffect)(() => {
    ensureRegistered();
    const suppressed = disabled || getMotionConfig().respectReducedMotion && reducedMotion;
    if (suppressed) return;
    const instance = createSmoothScroll(optionsRef.current);
    if (!instance) return;
    const disconnect = connectScrollTrigger(instance);
    setActiveLenis(instance);
    setLenis(instance);
    return () => {
      disconnect();
      instance.destroy();
      setActiveLenis(null);
      setLenis(null);
    };
  }, [reducedMotion, disabled]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LenisContext.Provider, { value: lenis, children });
}

// src/providers/PageTransitionProvider.tsx
var import_navigation = require("next/navigation");
var import_react5 = require("react");

// src/animations/transition.ts
function resetOverlay(overlay, variant) {
  ensureRegistered();
  const base = { pointerEvents: "none" };
  switch (variant) {
    case "fade":
      import_gsap.gsap.set(overlay, { ...base, autoAlpha: 0 });
      return;
    case "slide":
      import_gsap.gsap.set(overlay, { ...base, autoAlpha: 1, yPercent: 100 });
      return;
    case "curtain":
    default:
      import_gsap.gsap.set(overlay, {
        ...base,
        autoAlpha: 1,
        scaleY: 0,
        transformOrigin: "bottom center"
      });
  }
}
function coverAnimation(overlay, { variant, duration, ease }) {
  ensureRegistered();
  import_gsap.gsap.set(overlay, { pointerEvents: "auto" });
  switch (variant) {
    case "fade":
      return import_gsap.gsap.fromTo(
        overlay,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration, ease }
      );
    case "slide":
      return import_gsap.gsap.fromTo(
        overlay,
        { autoAlpha: 1, yPercent: 100 },
        { yPercent: 0, duration, ease }
      );
    case "curtain":
    default:
      return import_gsap.gsap.fromTo(
        overlay,
        { autoAlpha: 1, scaleY: 0, transformOrigin: "bottom center" },
        { scaleY: 1, duration, ease }
      );
  }
}
function revealAnimation(overlay, { variant, duration, ease }) {
  ensureRegistered();
  const onComplete = () => import_gsap.gsap.set(overlay, { pointerEvents: "none" });
  switch (variant) {
    case "fade":
      return import_gsap.gsap.to(overlay, { autoAlpha: 0, duration, ease, onComplete });
    case "slide":
      return import_gsap.gsap.fromTo(
        overlay,
        { yPercent: 0 },
        { yPercent: -100, duration, ease, onComplete }
      );
    case "curtain":
    default:
      return import_gsap.gsap.fromTo(
        overlay,
        { scaleY: 1, transformOrigin: "top center" },
        { scaleY: 0, duration, ease, onComplete }
      );
  }
}
var TRANSITION_DEFAULTS = {
  variant: "curtain",
  /** Deliberately shorter than `DURATION.reveal` — a transition is a gap in
   *  the experience, and every extra frame is dead time. */
  duration: DURATION.base,
  ease: EASING.dramatic
};

// src/hooks/useTransitionRouter.ts
var import_react4 = require("react");
var fallback = {
  push: () => {
  },
  replace: () => {
  },
  back: () => {
  },
  isTransitioning: false
};
var TransitionRouterContext = (0, import_react4.createContext)(null);
function useTransitionRouter() {
  return (0, import_react4.useContext)(TransitionRouterContext) ?? fallback;
}

// src/providers/PageTransitionProvider.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function restingStyle(variant) {
  switch (variant) {
    case "fade":
      return { opacity: 0, visibility: "hidden" };
    case "slide":
      return { transform: "translateY(100%)" };
    case "curtain":
    default:
      return { transform: "scaleY(0)", transformOrigin: "bottom center" };
  }
}
function PageTransitionProvider({
  children,
  variant = TRANSITION_DEFAULTS.variant,
  color = "#0a0a0a",
  duration = TRANSITION_DEFAULTS.duration,
  ease = TRANSITION_DEFAULTS.ease,
  overlayContent,
  disabled = false
}) {
  const router = (0, import_navigation.useRouter)();
  const pathname = (0, import_navigation.usePathname)();
  const overlayRef = (0, import_react5.useRef)(null);
  const phase = (0, import_react5.useRef)("idle");
  const [isTransitioning, setIsTransitioning] = (0, import_react5.useState)(false);
  const suppressed = (0, import_react5.useCallback)(() => {
    if (disabled) return true;
    return getMotionConfig().respectReducedMotion && prefersReducedMotion();
  }, [disabled]);
  const [, force] = (0, import_react5.useState)(0);
  (0, import_react5.useEffect)(() => subscribeToReducedMotion(() => force((n) => n + 1)), []);
  const navigate = (0, import_react5.useCallback)(
    (href, mode) => {
      const go = () => mode === "push" ? router.push(href) : router.replace(href);
      if (suppressed() || !overlayRef.current) {
        go();
        return;
      }
      if (phase.current !== "idle") return;
      ensureRegistered();
      phase.current = "covering";
      setIsTransitioning(true);
      coverAnimation(overlayRef.current, { variant, duration, ease }).eventCallback(
        "onComplete",
        () => {
          phase.current = "navigating";
          go();
        }
      );
    },
    [router, suppressed, variant, duration, ease]
  );
  (0, import_react5.useEffect)(() => {
    if (phase.current !== "navigating") return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    phase.current = "revealing";
    getLenis()?.scrollTo(0, { immediate: true });
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        import_ScrollTrigger.ScrollTrigger.refresh();
        revealAnimation(overlay, { variant, duration, ease }).eventCallback(
          "onComplete",
          () => {
            resetOverlay(overlay, variant);
            phase.current = "idle";
            setIsTransitioning(false);
          }
        );
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, variant, duration, ease]);
  const value = (0, import_react5.useMemo)(
    () => ({
      push: (href) => navigate(href, "push"),
      replace: (href) => navigate(href, "replace"),
      // Browser history restores scroll position itself; covering it would
      // fight that and land the user in the wrong place.
      back: () => router.back(),
      isTransitioning
    }),
    [navigate, router, isTransitioning]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(TransitionRouterContext.Provider, { value, children: [
    children,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        ref: overlayRef,
        "aria-hidden": "true",
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: color,
          pointerEvents: "none",
          display: "grid",
          placeItems: "center",
          willChange: "transform, opacity",
          ...restingStyle(variant)
        },
        children: overlayContent
      }
    )
  ] });
}

// src/components/TransitionLink.tsx
var import_link = __toESM(require("next/link"), 1);
var import_jsx_runtime3 = require("react/jsx-runtime");
function TransitionLink({
  instant = false,
  onClick,
  href,
  ...props
}) {
  const router = useTransitionRouter();
  const handleClick = (event) => {
    onClick?.(event);
    if (instant || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank") {
      return;
    }
    const url = typeof href === "string" ? href : href.toString();
    if (/^([a-z]+:)?\/\//i.test(url) || url.startsWith("mailto:")) return;
    event.preventDefault();
    router.push(url);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_link.default, { href, onClick: handleClick, ...props });
}

// src/hooks/useAnimation.ts
var import_react6 = require("@gsap/react");
var import_react7 = require("react");
function useGSAPAnimation(callback, options = {}) {
  ensureRegistered();
  const { scope, dependencies = [], revertOnUpdate = true } = options;
  (0, import_react6.useGSAP)(
    () => {
      const cleanup = callback();
      return typeof cleanup === "function" ? cleanup : void 0;
    },
    { dependencies, revertOnUpdate, ...scope ? { scope } : {} }
  );
}
function useReducedMotion() {
  const [reduced, setReduced] = (0, import_react7.useState)(false);
  (0, import_react7.useEffect)(() => {
    const sync = () => setReduced(isMotionSuppressed());
    sync();
    return subscribeToReducedMotion(sync);
  }, []);
  return reduced;
}

// src/hooks/useScroll.ts
var import_react8 = require("react");
function useScrollProgress(target, onProgress, options = {}) {
  const progress = (0, import_react8.useRef)(0);
  const callback = (0, import_react8.useRef)(onProgress);
  callback.current = onProgress;
  const start = options.start;
  const end = options.end;
  (0, import_react8.useEffect)(() => {
    ensureRegistered();
    if (!target.current) return;
    return watchScrollProgress(
      target.current,
      (value, direction) => {
        progress.current = value;
        callback.current?.(value, direction);
      },
      { start, end }
    );
  }, [target, start, end]);
  return progress;
}
function usePageScrollProgress(onProgress) {
  const progress = (0, import_react8.useRef)(0);
  const callback = (0, import_react8.useRef)(onProgress);
  callback.current = onProgress;
  (0, import_react8.useEffect)(() => {
    ensureRegistered();
    return watchPageScrollProgress((value) => {
      progress.current = value;
      callback.current?.(value);
    });
  }, []);
  return progress;
}

// src/hooks/useParallax.ts
var import_react9 = require("@gsap/react");
var import_react10 = require("react");
function useParallax(options = {}) {
  const ref = (0, import_react10.useRef)(null);
  ensureRegistered();
  const { speed, axis } = options;
  (0, import_react9.useGSAP)(
    () => {
      if (!ref.current) return;
      parallax(ref.current, options);
    },
    // Options is typically an inline literal, so depend on the values that
    // actually change the animation rather than object identity.
    { dependencies: [speed, axis] }
  );
  return ref;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_LENIS_OPTIONS,
  DISTANCE,
  DURATION,
  EASING,
  PageTransitionProvider,
  STAGGER,
  ScrollTrigger,
  SmoothScrollProvider,
  SplitText,
  TRANSITION_DEFAULTS,
  TransitionLink,
  batchReveal,
  configureMotion,
  connectScrollTrigger,
  createScrollAnimation,
  createSmoothScroll,
  ensureRegistered,
  fadeIn,
  fadeOut,
  getLenis,
  getMotionConfig,
  getPageScrollProgress,
  gsap,
  imageReveal,
  imageZoom,
  isBrowser,
  killScrollTriggers,
  parallax,
  pinSection,
  prefersReducedMotion,
  refreshScrollTriggers,
  resetMotionConfig,
  reveal,
  scaleImage,
  scrollTo,
  splitTextAnimation,
  subscribeToReducedMotion,
  textReveal,
  useGSAP,
  useGSAPAnimation,
  useLenis,
  useLenisScroll,
  usePageScrollProgress,
  useParallax,
  useReducedMotion,
  useScrollProgress,
  useScrollTo,
  useTransitionRouter,
  watchPageScrollProgress,
  watchScrollProgress
});
//# sourceMappingURL=index.cjs.map