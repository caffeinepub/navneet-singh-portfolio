import { useEffect, useRef } from "react";

export function useSectionObserver() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll(".section-hidden");

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("section-hidden");
            entry.target.classList.add("section-visible");
            observerRef.current?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    for (const section of sections) {
      observerRef.current.observe(section);
    }

    return () => observerRef.current?.disconnect();
  });
}
