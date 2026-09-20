import * as react from 'react';
import { RefObject, ReactNode, ComponentProps } from 'react';
import Lenis, { LenisOptions } from 'lenis';
export { default as Lenis, LenisOptions } from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
export { SplitText } from 'gsap/SplitText';
export { gsap } from 'gsap';
export { useGSAP } from '@gsap/react';

/**
 * Public type surface. This module must stay free of runtime imports so it can
 * be consumed by server components and type-only tooling.
 */

/**
 * Anything the engine can animate.
 *
 * React refs are accepted directly — passing `containerRef` is the common case
 * in components, and unwrapping it at every call site is noise.
 */
type MotionTarget = string | Element | Element[] | NodeListOf<Element> | RefObject<Element | null> | null | undefined;
/** Where an animation sits relative to the scroll position. */
interface ScrollOptions {
    /** Element whose position defines the range. Defaults to the animated target. */
    trigger?: MotionTarget;
    /** ScrollTrigger `start`, e.g. `"top 80%"`. */
    start?: string | number;
    /** ScrollTrigger `end`, e.g. `"bottom 20%"` or `"+=100%"`. */
    end?: string | number;
    /**
     * Tie progress to scroll position. `true` is 1:1; a number is the seconds the
     * playhead takes to catch up (1 is a good cinematic default).
     */
    scrub?: boolean | number;
    /** Pin the trigger (or a given element) for the duration of the range. */
    pin?: boolean | MotionTarget;
    /** Default `true`. Set `false` only when reserving the space yourself. */
    pinSpacing?: boolean;
    /** Play/reverse behaviour when not scrubbing. Ignored when `scrub` is set. */
    toggleActions?: string;
    /** Run once, then kill the trigger. */
    once?: boolean;
    /** Dev-only start/end markers. Forced off in production builds. */
    markers?: boolean;
    /** Lower numbers refresh first; set when creating triggers out of page order. */
    refreshPriority?: number;
    /** Unique id for `ScrollTrigger.getById()`. */
    id?: string;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
    onUpdate?: (progress: number, direction: 1 | -1) => void;
}
/** Options shared by every animation primitive. */
interface MotionOptions {
    /** Seconds. Defaults to `DURATION.base`. Prefer a `DURATION` token. */
    duration?: number;
    /** Seconds before the animation starts. */
    delay?: number;
    /** Prefer an `EASING` token over a raw GSAP string. */
    ease?: string;
    /** Seconds between elements when the target resolves to more than one. */
    stagger?: number;
    /**
     * Attach the animation to scroll. `true` uses sensible reveal defaults;
     * an object customises the range.
     */
    scroll?: ScrollOptions | boolean;
    onComplete?: () => void;
    onStart?: () => void;
}
/** Direction an element travels from as it reveals. */
type MotionDirection = "up" | "down" | "left" | "right" | "none";
interface FadeOptions extends MotionOptions {
    /** Starting opacity for `fadeIn`, target opacity for `fadeOut`. */
    opacity?: number;
}
interface RevealOptions extends MotionOptions {
    /** Where the element travels from. Default `"up"`. */
    direction?: MotionDirection;
    /** Travel distance in pixels. Defaults to `DISTANCE.md`. */
    distance?: number;
    /** Starting opacity. Default `0`. */
    from?: number;
}
interface TextRevealOptions extends MotionOptions {
    /** Granularity of the split. Default `"lines"` — cheapest and most legible. */
    split?: "chars" | "words" | "lines";
    /** Travel distance in pixels. Default `100`. */
    distance?: number;
    /**
     * Wrap each unit in an `overflow: clip` element so text slides out from
     * behind a mask. This is the signature editorial reveal. Default `true`.
     */
    mask?: boolean;
}
interface ParallaxOptions {
    /**
     * Travel as a fraction of the scroll range. Positive lags behind the scroll
     * (the usual look), negative runs ahead. Default `0.2`. Keep under ~0.4.
     */
    speed?: number;
    /** Axis to displace. Default `"y"`. */
    axis?: "x" | "y";
    scroll?: ScrollOptions;
}
interface ScaleOptions extends MotionOptions {
    /** Starting scale. Default `1.15`. */
    from?: number;
    /** Ending scale. Default `1`. */
    to?: number;
}
interface ImageZoomOptions {
    /** Scale at the start of the scroll range. Default `1`. */
    from?: number;
    /** Scale at the end. Default `1.2`. */
    to?: number;
    scroll?: ScrollOptions;
}
interface PinOptions {
    /** Element that stays fixed. Defaults to the trigger. */
    pin?: MotionTarget;
    start?: string | number;
    /** Default `"+=100%"` — pins for one additional viewport of scrolling. */
    end?: string | number;
    /** Default `true`. */
    pinSpacing?: boolean;
    /** Optional timeline scrubbed across the pinned range. */
    animation?: gsap.core.Animation;
    scrub?: boolean | number;
    markers?: boolean;
    id?: string;
    onProgress?: (progress: number) => void;
}
/**
 * Overlay style for a route change.
 *
 * - `curtain` — panel scales up from the bottom, then away off the top.
 * - `slide` — panel travels through the viewport in one direction.
 * - `fade` — plain cross-fade. The safest choice over busy imagery.
 */
type PageTransitionVariant = "curtain" | "slide" | "fade";
/** Runtime-tunable engine behaviour. Set once, at app startup. */
interface MotionEngineConfig {
    /** Honour `prefers-reduced-motion`. Default `true`. Do not disable lightly. */
    respectReducedMotion: boolean;
    /** Force ScrollTrigger markers on for every trigger. Dev only. */
    markers: boolean;
    /** Fallback duration when a primitive is not given one. */
    defaultDuration: number;
    /** Fallback ease when a primitive is not given one. */
    defaultEase: string;
}

/**
 * The LeadStrikes motion language.
 *
 * These tokens are the entire point of the engine. A site that only ever pulls
 * timings from `DURATION` and curves from `EASING` will feel like one designed
 * system; a site with hand-typed `0.73`s will feel arbitrary, and no one will
 * be able to say why.
 *
 * Treat them as a palette, not a suggestion.
 */

/** Seconds. Four speeds, deliberately. */
declare const DURATION: {
    /** Micro-interactions: hovers, button states, cursor feedback. */
    readonly fast: 0.4;
    /** The default. Most UI transitions. */
    readonly base: 0.8;
    /** Deliberate, weighty moves. Section changes. */
    readonly slow: 1.2;
    /** Hero and headline entrances. The slowest thing on the site. */
    readonly reveal: 1.6;
};
/**
 * Named easing curves. The names describe intent, not the underlying maths, so
 * a curve can be retuned globally without touching call sites.
 */
declare const EASING: {
    /** Gentle settle. Safe default for small UI moves. */
    readonly soft: "power2.out";
    /** The signature curve: fast departure, long graceful arrival. */
    readonly premium: "expo.out";
    /** Heavy, cinematic. Full-section and pinned transitions. */
    readonly dramatic: "power4.inOut";
    /** Symmetrical. Loops and continuous motion. */
    readonly smooth: "power1.inOut";
    /**
     * Linear. Required for anything driven by `scrub` — any other curve breaks
     * the 1:1 mapping between scroll position and animation progress.
     */
    readonly none: "none";
};
/** Seconds between elements in a group reveal. */
declare const STAGGER: {
    readonly tight: 0.04;
    readonly base: 0.08;
    readonly loose: 0.16;
};
/** Travel distances in pixels for reveal animations. */
declare const DISTANCE: {
    readonly sm: 24;
    readonly md: 48;
    readonly lg: 96;
};
type DurationToken = keyof typeof DURATION;
type EasingToken = keyof typeof EASING;
/**
 * Adjusts engine-wide behaviour.
 *
 * This is the supported way for a site to change how the engine behaves — it
 * exists so client projects never need to edit engine source. Call once during
 * app startup, before the first animation is created.
 */
declare function configureMotion(overrides: Partial<MotionEngineConfig>): void;
/** Current engine configuration. */
declare function getMotionConfig(): Readonly<MotionEngineConfig>;
/** Restores defaults. Intended for tests. */
declare function resetMotionConfig(): void;

/**
 * Single point of GSAP plugin registration.
 *
 * Registration is lazy and idempotent: every public entry point in the engine
 * calls `ensureRegistered()` first, so consumers never have to remember to
 * register anything, and `sideEffects: false` stays honest for tree-shaking.
 */

/**
 * Registers plugins and applies global defaults.
 * Idempotent, and a no-op on the server.
 */
declare function ensureRegistered(): void;

/**
 * Environment probes. Every other module routes browser checks through here so
 * there is exactly one definition of "are we allowed to touch the DOM".
 */
/** True only in a real browser. Guards every DOM entry point in the engine. */
declare const isBrowser: boolean;
/** Whether the visitor has asked their OS to reduce motion. */
declare function prefersReducedMotion(): boolean;
/**
 * Subscribes to changes of the reduced-motion setting.
 * Returns an unsubscribe function; a no-op on the server.
 */
declare function subscribeToReducedMotion(onChange: () => void): () => void;

/**
 * Lenis lifecycle and the Lenis <-> ScrollTrigger bridge.
 *
 * Lenis scrolls the real window, so ScrollTrigger needs no `scrollerProxy`.
 * What it does need is to be told when Lenis moved, and Lenis needs to be
 * driven from GSAP's ticker — otherwise the two run on separate rAF loops and
 * every scroll-linked animation trails the scroll position by a frame.
 */

/**
 * House scroll feel. Tuned once here rather than per project so every
 * LeadStrikes site scrolls with the same weight.
 */
declare const DEFAULT_LENIS_OPTIONS: LenisOptions;
/**
 * Creates a Lenis instance using the house defaults.
 * Returns `null` on the server.
 */
declare function createSmoothScroll(options?: LenisOptions): Lenis | null;
/**
 * Puts Lenis and ScrollTrigger on one clock.
 * Returns a teardown that fully unwinds the connection.
 */
declare function connectScrollTrigger(lenis: Lenis): () => void;
/**
 * The active Lenis instance, or `null` when smooth scrolling is off — either
 * because no provider is mounted or the visitor prefers reduced motion.
 */
declare function getLenis(): Lenis | null;
/** Options accepted by {@link scrollTo}. */
interface ScrollToOptions {
    /** Pixels to offset the final position by. Negative scrolls further up. */
    offset?: number;
    /** Seconds. Defaults to the instance's configured duration. */
    duration?: number;
    /** Jump with no animation. */
    immediate?: boolean;
    onComplete?: () => void;
}
/**
 * Scrolls to an element, selector, or absolute offset.
 *
 * Falls back to native scrolling when Lenis is not active, so anchor navigation
 * keeps working under reduced motion.
 */
declare function scrollTo(target: string | Element | number, options?: ScrollToOptions): void;

/**
 * Opacity primitives.
 *
 * `autoAlpha` is used rather than `opacity` so a faded-out element also gets
 * `visibility: hidden` and stops intercepting pointer events.
 */

/**
 * Fades a target in from transparent.
 *
 * @example
 * ```ts
 * fadeIn(ref, { scroll: true, duration: DURATION.slow });
 * ```
 */
declare function fadeIn(target: MotionTarget, options?: FadeOptions): gsap.core.Tween | null;
/** Fades a target out. Leaves it `visibility: hidden` when fully transparent. */
declare function fadeOut(target: MotionTarget, options?: FadeOptions): gsap.core.Tween | null;

/**
 * Reveal primitives — the workhorses of a premium site.
 *
 * All of these are *essential* motion: they carry content into view. Under
 * reduced motion the timings collapse to zero so the content still arrives.
 */

/**
 * Slides an element in while fading it up. The default reveal for any section.
 *
 * @example
 * ```ts
 * reveal(".stat", { direction: "up", stagger: STAGGER.base, scroll: true });
 * ```
 */
declare function reveal(target: MotionTarget, options?: RevealOptions): gsap.core.Tween | null;
/**
 * Reveals text by line, word, or character using SplitText.
 *
 * Splitting is deferred until fonts are ready — measuring line breaks against a
 * fallback font produces wrong lines that visibly re-flow on font swap.
 *
 * Returns a cleanup function that reverts both the animation and the DOM split.
 * Call it on unmount, or create this inside `useGSAPAnimation`, which does so
 * automatically.
 *
 * @example
 * ```ts
 * useGSAPAnimation(() => textReveal(headingRef, { split: "lines" }), { scope });
 * ```
 */
declare function textReveal(target: MotionTarget, options?: TextRevealOptions): () => void;
/**
 * Alias of {@link textReveal}, kept because "splitTextAnimation" is the name
 * most people search for.
 */
declare const splitTextAnimation: typeof textReveal;

/**
 * Parallax.
 *
 * Purely decorative: there is no end state to arrive at, the movement *is* the
 * effect. Under reduced motion it is not created at all.
 */

/**
 * Moves a target at a different rate than the scroll.
 *
 * Displacement is expressed in percent of the element's own size, so the effect
 * holds at every viewport without media queries.
 *
 * Keep `speed` under ~0.4. Beyond that the element visibly detaches from the
 * layout and the page reads as broken rather than deep.
 *
 * @example
 * ```ts
 * parallax(".hero-bg", { speed: 0.25 });
 * ```
 */
declare function parallax(target: MotionTarget, options?: ParallaxOptions): gsap.core.Tween | null;

/**
 * Scale primitives.
 */

/**
 * Settles an element from a larger scale down to rest, fading in as it lands.
 *
 * Used on imagery, this reads as the photograph "settling" into the layout —
 * the effect behind most luxury architecture and automotive sites.
 *
 * The element should sit inside a container with `overflow: hidden`, otherwise
 * the oversized start state spills past the intended frame.
 *
 * @example
 * ```ts
 * scaleImage(imageRef, { from: 1.15, scroll: true });
 * ```
 */
declare function scaleImage(target: MotionTarget, options?: ScaleOptions): gsap.core.Tween | null;

/**
 * Image-specific effects.
 *
 * Both of these assume the image sits inside a clipping frame:
 *
 * ```html
 * <div class="frame" style="overflow: hidden">
 *   <img class="photo" />
 * </div>
 * ```
 */

/**
 * Scales an image continuously across its scroll range.
 *
 * Decorative — skipped entirely under reduced motion.
 *
 * @example
 * ```ts
 * imageZoom(".photo", { from: 1, to: 1.2 });
 * ```
 */
declare function imageZoom(target: MotionTarget, options?: ImageZoomOptions): gsap.core.Tween | null;
interface ImageRevealOptions extends MotionOptions {
    /** Edge the clip opens from. Default `"bottom"`. */
    direction?: "top" | "bottom" | "left" | "right";
    /**
     * Counter-scale the image while the clip opens, so the photo appears to
     * settle rather than simply be uncovered. Default `1.15`.
     */
    scale?: number;
}
/**
 * Uncovers an image with a clip-path wipe while it settles from a larger scale.
 *
 * This is the signature editorial image entrance. `clip-path` is animated
 * rather than width/height because it never triggers layout.
 *
 * @example
 * ```ts
 * imageReveal(".photo", { direction: "bottom", scroll: true });
 * ```
 */
declare function imageReveal(target: MotionTarget, options?: ImageRevealOptions): gsap.core.Timeline | null;

/**
 * Section pinning — the backbone of scroll-driven storytelling.
 */

/**
 * Holds a section fixed while the page scrolls past it, optionally scrubbing a
 * timeline across the pinned range.
 *
 * Never animate the pinned element itself — GSAP owns its transform while it is
 * pinned. Animate its children.
 *
 * Pinning is skipped under reduced motion: a section that traps the scroll is a
 * usability problem, not a decoration.
 *
 * @example
 * ```ts
 * const tl = gsap.timeline()
 *   .to(".panel-1", { autoAlpha: 0, ease: EASING.none })
 *   .to(".panel-2", { autoAlpha: 1, ease: EASING.none });
 *
 * pinSection(sectionRef, { animation: tl, end: "+=200%", scrub: 1 });
 * ```
 */
declare function pinSection(target: MotionTarget, options?: PinOptions): ScrollTrigger | null;

/**
 * The low-level scroll escape hatch.
 *
 * The animation primitives cover the common cases. When a site needs something
 * they don't express, it reaches for this rather than editing the engine.
 */

interface CreateScrollAnimationOptions extends ScrollOptions {
    /** Element defining the scroll range. */
    trigger: MotionTarget;
    /** Timeline or tween to drive. Omit for a callback-only trigger. */
    animation?: gsap.core.Animation;
}
/**
 * Creates a ScrollTrigger, optionally bound to an existing animation.
 * Returns `null` on the server or when the trigger cannot be resolved.
 *
 * @example
 * ```ts
 * const tl = gsap.timeline().to(".panel", { xPercent: -100, ease: EASING.none });
 * createScrollAnimation({
 *   trigger: sectionRef,
 *   animation: tl,
 *   start: "top top",
 *   end: "+=200%",
 *   scrub: 1,
 *   pin: true,
 * });
 * ```
 */
declare function createScrollAnimation(options: CreateScrollAnimationOptions): ScrollTrigger | null;
/**
 * Recalculates every trigger's start/end.
 *
 * ScrollTrigger handles viewport resizes itself. Call this after layout shifts
 * it cannot observe: late-loading fonts, images without dimensions, an
 * accordion opening.
 */
declare function refreshScrollTriggers(): void;
/**
 * Kills every ScrollTrigger and reverts the styles they applied.
 *
 * Rarely needed — `useGSAPAnimation` and `useGSAP` clean up their own triggers.
 * Useful on hard route transitions that replace the whole document body.
 */
declare function killScrollTriggers(): void;

/**
 * Scroll progress observation.
 *
 * Progress is delivered through a callback rather than React state on purpose:
 * a scroll handler that calls `setState` re-renders the tree on every frame.
 * Drive a ref, a CSS variable, or a GSAP quickSetter from these instead.
 */

/**
 * Reports 0→1 progress as `target` moves through the scroll range.
 * Returns an unsubscribe function.
 */
declare function watchScrollProgress(target: MotionTarget, onProgress: (progress: number, direction: 1 | -1) => void, options?: Omit<ScrollOptions, "trigger" | "onUpdate">): () => void;
/** Current page scroll progress, 0→1. Returns 0 on the server. */
declare function getPageScrollProgress(): number;
/**
 * Reports overall page scroll progress, 0→1.
 * Returns an unsubscribe function.
 */
declare function watchPageScrollProgress(onProgress: (progress: number) => void): () => void;

/**
 * Batched reveals.
 *
 * One ScrollTrigger per card in a 40-card grid is 40 sets of start/end
 * calculations on every refresh. `ScrollTrigger.batch()` groups the elements
 * that cross the threshold in the same frame and animates them together, which
 * is both cheaper and the only way to get a correct stagger across a grid.
 */

interface BatchRevealOptions extends RevealOptions {
    /** Max elements per batch. Default 8. */
    batchMax?: number;
    /** Seconds to collect a batch. Default one frame. */
    interval?: number;
    /** Reverse the reveal when scrolling back up. Default `false`. */
    reverse?: boolean;
    /** ScrollTrigger start. Default `"top 85%"`. */
    start?: string;
}
/**
 * Reveals many elements as they enter the viewport, staggered per batch.
 *
 * @example
 * ```ts
 * batchReveal(".card", { direction: "up", stagger: STAGGER.base });
 * ```
 */
declare function batchReveal(targets: MotionTarget, options?: BatchRevealOptions): ScrollTrigger[];

interface SmoothScrollProviderProps {
    children: ReactNode;
    /**
     * Lenis overrides merged over the house defaults.
     * Read once, on mount — later changes are ignored.
     */
    options?: LenisOptions;
    /**
     * Skip Lenis entirely and use native scrolling. Useful for admin routes or
     * embedded views where smooth scroll fights the host page.
     */
    disabled?: boolean;
}
/**
 * Owns the single Lenis instance for the application and keeps it on the same
 * clock as GSAP and ScrollTrigger.
 *
 * Mount once, inside the root layout's `<body>`. Every page below it gets
 * smooth scroll with no further setup.
 *
 * @example
 * ```tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <SmoothScrollProvider>{children}</SmoothScrollProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
declare function SmoothScrollProvider({ children, options, disabled, }: SmoothScrollProviderProps): react.JSX.Element;

interface PageTransitionProviderProps {
    children: ReactNode;
    /** Overlay style. Default `"curtain"`. */
    variant?: PageTransitionVariant;
    /** Overlay colour. Should match the site background or a brand tone. */
    color?: string;
    /** Seconds per half of the transition. Default `DURATION.base`. */
    duration?: number;
    /** Easing. Default `EASING.dramatic`. */
    ease?: string;
    /** Optional content rendered inside the overlay, e.g. a logo mark. */
    overlayContent?: ReactNode;
    /** Skip transitions entirely and navigate immediately. */
    disabled?: boolean;
}
/**
 * Cinematic route transitions.
 *
 * Mount inside `SmoothScrollProvider`, in the root layout. Navigate with
 * {@link useTransitionRouter} or `TransitionLink` — a plain `next/link`
 * bypasses the transition and navigates instantly.
 *
 * Under reduced motion the overlay never animates; navigation is immediate.
 *
 * @example
 * ```tsx
 * <SmoothScrollProvider>
 *   <PageTransitionProvider variant="curtain" color="#0a0a0a">
 *     {children}
 *   </PageTransitionProvider>
 * </SmoothScrollProvider>
 * ```
 */
declare function PageTransitionProvider({ children, variant, color, duration, ease, overlayContent, disabled, }: PageTransitionProviderProps): react.JSX.Element;

interface TransitionLinkProps extends ComponentProps<typeof Link> {
    /** Navigate immediately, skipping the transition. */
    instant?: boolean;
}
/**
 * Drop-in `next/link` replacement that plays the page transition.
 *
 * Renders a real anchor, so prefetching, middle-click, ctrl-click and "open in
 * new tab" all behave normally — only a plain left click is intercepted.
 *
 * @example
 * ```tsx
 * <TransitionLink href="/work">Work</TransitionLink>
 * ```
 */
declare function TransitionLink({ instant, onClick, href, ...props }: TransitionLinkProps): react.JSX.Element;

/** Navigation API that plays the page transition around the route change. */
interface TransitionRouter {
    /** Navigate forward, covering and revealing around the route change. */
    push: (href: string) => void;
    /** Replace the current entry, with the same transition. */
    replace: (href: string) => void;
    /** Go back. Browser history restores scroll, so no cover animation plays. */
    back: () => void;
    /** True while a transition is playing. Use to disable nav during it. */
    isTransitioning: boolean;
}
/**
 * Navigation that plays the page transition.
 *
 * Returns a no-op router when no `PageTransitionProvider` is mounted, so a
 * component using it does not crash on a page that has no transitions.
 *
 * @example
 * ```tsx
 * const router = useTransitionRouter();
 * <button onClick={() => router.push("/work")}>Work</button>
 * ```
 */
declare function useTransitionRouter(): TransitionRouter;

/**
 * Page transition overlay animations.
 *
 * These build the two halves of a route change: `cover` hides the outgoing
 * page, `reveal` uncovers the incoming one. Both animate transform or opacity
 * on a single fixed element, so a transition never triggers layout.
 */

/** House defaults for a route change. */
declare const TRANSITION_DEFAULTS: {
    readonly variant: PageTransitionVariant;
    /** Deliberately shorter than `DURATION.reveal` — a transition is a gap in
     *  the experience, and every extra frame is dead time. */
    readonly duration: 0.8;
    readonly ease: "power4.inOut";
};

/** The active Lenis instance, or `null` when smooth scrolling is off. */
declare function useLenis(): Lenis | null;
/**
 * Subscribes to Lenis scroll events for the lifetime of the component.
 *
 * The callback fires every frame while scrolling, so it must not call
 * `setState`. Write to a ref or drive a GSAP setter instead.
 *
 * Wrap the callback in `useCallback`, or it re-subscribes on every render.
 */
declare function useLenisScroll(callback: (lenis: Lenis) => void): void;
/**
 * Returns a stable scroll-to function for nav links and back-to-top buttons.
 *
 * Falls back to native scrolling when Lenis is off, so anchors keep working
 * under reduced motion.
 *
 * @example
 * ```tsx
 * const scrollTo = useScrollTo();
 * <button onClick={() => scrollTo("#contact", { offset: -80 })}>Contact</button>
 * ```
 */
declare function useScrollTo(): (target: string | Element | number, options?: ScrollToOptions) => void;

interface UseGSAPAnimationOptions {
    /**
     * Container ref. Selector strings inside the callback resolve within it, so
     * `".card"` cannot reach into a sibling component. Always pass this when the
     * callback uses selectors.
     */
    scope?: RefObject<Element | null>;
    /** Re-runs the callback when these change. Defaults to `[]` (mount only). */
    dependencies?: unknown[];
    /** Revert and rebuild when dependencies change. Default `true`. */
    revertOnUpdate?: boolean;
}
/**
 * The engine's animation entry point for components.
 *
 * A thin wrapper over `useGSAP` that additionally:
 * - registers plugins before the callback runs, so order never matters;
 * - runs any cleanup function the callback returns (SplitText reverts, manual
 *   `ScrollTrigger.kill()`), which `useGSAP` does not do on its own.
 *
 * Everything created inside is reverted on unmount and re-run under React
 * Strict Mode's double-invoke without duplicating triggers.
 *
 * @example
 * ```tsx
 * const scope = useRef<HTMLDivElement>(null);
 *
 * useGSAPAnimation(() => {
 *   reveal(".headline", { scroll: true });
 *   parallax(".backdrop", { speed: 0.2 });
 * }, { scope });
 * ```
 */
declare function useGSAPAnimation(callback: () => void | (() => void), options?: UseGSAPAnimationOptions): void;
/**
 * Live reduced-motion state for conditional rendering — swapping a scroll-driven
 * video for a still image, for example.
 *
 * Animation primitives already handle reduced motion internally; reach for this
 * only when the *markup* needs to differ.
 */
declare function useReducedMotion(): boolean;

/**
 * Reports 0→1 progress as an element moves through the viewport.
 *
 * Progress arrives through a ref, not state. A scroll handler that calls
 * `setState` re-renders the component on every frame and will not hold 60fps.
 * Read `ref.current` from a GSAP ticker, or write straight to a CSS variable.
 *
 * @example
 * ```tsx
 * const section = useRef<HTMLDivElement>(null);
 * const progress = useScrollProgress(section, (p) => {
 *   bar.current?.style.setProperty("--progress", String(p));
 * });
 * ```
 */
declare function useScrollProgress(target: RefObject<Element | null>, onProgress?: (progress: number, direction: 1 | -1) => void, options?: Omit<ScrollOptions, "trigger" | "onUpdate">): RefObject<number>;
/**
 * Reports overall page scroll progress, 0→1. Useful for reading-progress bars.
 *
 * Same contract as {@link useScrollProgress}: value arrives via ref.
 */
declare function usePageScrollProgress(onProgress?: (progress: number) => void): RefObject<number>;

/**
 * Attaches parallax to an element and returns the ref to spread onto it.
 *
 * @example
 * ```tsx
 * const backdrop = useParallax<HTMLDivElement>({ speed: 0.25 });
 * return <div ref={backdrop} className="backdrop" />;
 * ```
 */
declare function useParallax<T extends Element = HTMLDivElement>(options?: ParallaxOptions): RefObject<T | null>;

export { type BatchRevealOptions, type CreateScrollAnimationOptions, DEFAULT_LENIS_OPTIONS, DISTANCE, DURATION, type DurationToken, EASING, type EasingToken, type FadeOptions, type ImageRevealOptions, type ImageZoomOptions, type MotionDirection, type MotionEngineConfig, type MotionOptions, type MotionTarget, PageTransitionProvider, type PageTransitionProviderProps, type PageTransitionVariant, type ParallaxOptions, type PinOptions, type RevealOptions, STAGGER, type ScaleOptions, type ScrollOptions, type ScrollToOptions, SmoothScrollProvider, type SmoothScrollProviderProps, TRANSITION_DEFAULTS, type TextRevealOptions, TransitionLink, type TransitionLinkProps, type TransitionRouter, type UseGSAPAnimationOptions, batchReveal, configureMotion, connectScrollTrigger, createScrollAnimation, createSmoothScroll, ensureRegistered, fadeIn, fadeOut, getLenis, getMotionConfig, getPageScrollProgress, imageReveal, imageZoom, isBrowser, killScrollTriggers, parallax, pinSection, prefersReducedMotion, refreshScrollTriggers, resetMotionConfig, reveal, scaleImage, scrollTo, splitTextAnimation, subscribeToReducedMotion, textReveal, useGSAPAnimation, useLenis, useLenisScroll, usePageScrollProgress, useParallax, useReducedMotion, useScrollProgress, useScrollTo, useTransitionRouter, watchPageScrollProgress, watchScrollProgress };
