"use client";

import { ReactNode, useEffect, useRef } from "react";

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateTo(el: HTMLElement, target: number, duration: number, onDone?: () => void) {
  const from = el.scrollTop;
  const dist = target - from;
  if (Math.abs(dist) < 1) {
    onDone?.();
    return;
  }
  const t0 = performance.now();
  function step(now: number) {
    const p = Math.min((now - t0) / duration, 1);
    el.scrollTop = from + dist * easeInOut(p);
    if (p < 1) requestAnimationFrame(step);
    else onDone?.();
  }
  requestAnimationFrame(step);
}

function sectionTop(section: HTMLElement, container: HTMLElement): number {
  return section.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
}

export function ScrollContainer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function sections(): HTMLElement[] {
      return Array.from(el!.children) as HTMLElement[];
    }

    function currentIdx(): number {
      const st = el!.scrollTop;
      const all = sections();
      let idx = 0;
      for (let i = 0; i < all.length; i++) {
        if (sectionTop(all[i], el!) <= st + 5) idx = i;
      }
      return idx;
    }

    function goToSection(idx: number) {
      const all = sections();
      if (idx < 0 || idx >= all.length || busy.current) return;
      busy.current = true;
      animateTo(el!, sectionTop(all[idx], el!), 600, () => {
        busy.current = false;
      });
    }

    function scroll(e: WheelEvent) {
      e.preventDefault();
      if (busy.current) return;

      const all = sections();
      const idx = currentIdx();
      const section = all[idx];
      const st = el!.scrollTop;
      const vh = el!.clientHeight;
      const top = sectionTop(section, el!);
      const bottom = top + section.offsetHeight;
      const viewBottom = st + vh;
      const isTall = section.offsetHeight > vh + 10;

      if (e.deltaY > 0) {
        if (isTall && viewBottom < bottom - 10) {
          // scroll down within section — one "page" at a time
          busy.current = true;
          animateTo(el!, Math.min(st + vh * 0.85, bottom - vh), 400, () => {
            busy.current = false;
          });
        } else {
          goToSection(idx + 1);
        }
      } else {
        if (isTall && st > top + 10) {
          // scroll up within section
          busy.current = true;
          animateTo(el!, Math.max(st - vh * 0.85, top), 400, () => {
            busy.current = false;
          });
        } else {
          goToSection(idx - 1);
        }
      }
    }

    function touchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }

    function touchEnd(e: TouchEvent) {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40 || busy.current) return;

      const all = sections();
      const idx = currentIdx();
      const section = all[idx];
      const st = el!.scrollTop;
      const vh = el!.clientHeight;
      const top = sectionTop(section, el!);
      const bottom = top + section.offsetHeight;
      const viewBottom = st + vh;
      const isTall = section.offsetHeight > vh + 10;

      if (delta > 0) {
        if (isTall && viewBottom < bottom - 10) {
          busy.current = true;
          animateTo(el!, Math.min(st + vh * 0.85, bottom - vh), 400, () => {
            busy.current = false;
          });
        } else {
          goToSection(idx + 1);
        }
      } else {
        if (isTall && st > top + 10) {
          busy.current = true;
          animateTo(el!, Math.max(st - vh * 0.85, top), 400, () => {
            busy.current = false;
          });
        } else {
          goToSection(idx - 1);
        }
      }
    }

    el.addEventListener("wheel", scroll, { passive: false });
    el.addEventListener("touchstart", touchStart, { passive: true });
    el.addEventListener("touchend", touchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", scroll);
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchend", touchEnd);
    };
  }, []);

  return (
    <div ref={ref} className="scroll-container">
      {children}
    </div>
  );
}
