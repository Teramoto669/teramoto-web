"use client";

import { useEffect } from "react";

export default function SpotlightEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !target.closest) return;
      
      const card = target.closest(".card, .badge, .btn, [class*='skillCard'], [class*='Navbar_link'], [class*='Navbar_cta'], [class*='Navbar_mobileLink']") as HTMLElement;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
}
