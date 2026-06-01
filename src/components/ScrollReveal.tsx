"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: "up" | "left" | "right" | "scale";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ 
  children, 
  animation = "up", 
  delay = 0, 
  className = "" 
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.15,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const animationClass = 
    animation === "up" ? "reveal-up" : 
    animation === "left" ? "reveal-left" : 
    animation === "right" ? "reveal-right" : 
    "reveal-scale";

  return (
    <div
      ref={ref}
      className={`${animationClass} ${isVisible ? "reveal-active" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
