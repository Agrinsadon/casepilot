"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Tracks scroll-triggered section entry via IntersectionObserver and exposes
 * a ref-registration callback plus a smooth-scroll-to-section helper.
 */
export function useSectionObserver<K extends string>(onEnter: (key: K) => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<K, HTMLDivElement>>(new Map());
  const onEnterRef = useRef(onEnter);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute("data-key") as K | null;
            if (key) onEnterRef.current(key);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -35% 0px" }
    );
    observerRef.current = observer;

    elementsRef.current.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.65) {
        const key = el.getAttribute("data-key") as K | null;
        if (key) onEnterRef.current(key);
      }
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const registerSection = useCallback(
    (key: K) => (el: HTMLDivElement | null) => {
      const previous = elementsRef.current.get(key);
      if (previous && observerRef.current) observerRef.current.unobserve(previous);

      if (el) {
        elementsRef.current.set(key, el);
        if (observerRef.current) observerRef.current.observe(el);
      } else {
        elementsRef.current.delete(key);
      }
    },
    []
  );

  const scrollToKey = useCallback((key: K) => {
    const el = elementsRef.current.get(key);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  return { registerSection, scrollToKey };
}
