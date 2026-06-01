"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    // Track mouse position
    const mouse = { x: -9999, y: -9999, radius: 70 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      opacity: number;
      baseOpacity: number;
      color: string;
      vx: number;
      vy: number;
      /** 0 = untouched, 1 = fully pushed — drives line cutoff */
      pushRatio: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseX = this.x;
        this.baseY = this.y;

        const isLight = theme === "light";

        this.baseSize = isLight
          ? Math.random() * 2.5 + 1.2   // 1.2 – 3.7 px
          : Math.random() * 2.0 + 0.9;  // 0.9 – 2.9 px  ← boosted for dark
        this.size = this.baseSize;

        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.4 - 0.08; // float upward
        this.vx = 0;
        this.vy = 0;
        this.pushRatio = 0;

        this.baseOpacity = isLight
          ? Math.random() * 0.55 + 0.35  // 0.35 – 0.90
          : Math.random() * 0.50 + 0.30; // 0.30 – 0.80  ← boosted for dark
        this.opacity = this.baseOpacity;

        const colors = isLight
          ? [
            "rgba(26, 95, 122, OPACITY)",   // Deep Teal
            "rgba(53, 133, 142, OPACITY)",   // Teal
            "rgba(80, 160, 110, OPACITY)",   // Green
            "rgba(194, 208, 153, OPACITY)",  // Sage
          ]
          : [
            "rgba(36, 177, 177, OPACITY)",   // Bright Teal
            "rgba(100, 210, 210, OPACITY)",  // Light Cyan  ← new
            "rgba(0, 200, 180, OPACITY)",    // Aqua        ← new
            "rgba(255, 240, 228, OPACITY)",  // Peach
          ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Autonomous drift
        this.baseX += this.speedX;
        this.baseY += this.speedY;

        // Wrap
        if (this.baseY < -10) this.baseY = canvas!.height + 10;
        if (this.baseX > canvas!.width + 10) this.baseX = -10;
        else if (this.baseX < -10) this.baseX = canvas!.width + 10;

        // Mouse repulsion
        const dx = this.baseX - mouse.x;
        const dy = this.baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius; // 0..1
          const angle = Math.atan2(dy, dx);

          // Push velocity — stronger burst so they fly away
          this.vx += Math.cos(angle) * force * 4;
          this.vy += Math.sin(angle) * force * 4;

          // Grow & brighten
          const growFactor = theme === "light" ? 3.5 : 3.0;
          this.size = this.baseSize + force * growFactor;
          this.opacity = Math.min(1, this.baseOpacity + force * 0.45);
          this.pushRatio = force;
        } else {
          // Snap back size/opacity instantly — no easing
          this.size = this.baseSize;
          this.opacity = this.baseOpacity;
          // pushRatio fades so lines reconnect after particle has moved away
          this.pushRatio *= 0.85;
        }

        // Integrate velocity into base position — particles KEEP drifting,
        // they do NOT return to where they started
        this.baseX += this.vx;
        this.baseY += this.vy;
        this.x = this.baseX;
        this.y = this.baseY;

        // Gentle damping so push persists for a while before fading
        this.vx *= 0.90;
        this.vy *= 0.90;

        this.draw();
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace("OPACITY", this.opacity.toFixed(3));
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const isMobile = window.innerWidth <= 768;
      // Slightly denser for both modes, but lower particle count on mobile to save CPU
      const baseDensity = theme === "light" ? 9000 : 10000;
      const density = isMobile ? baseDensity * 2 : baseDensity;
      const count = Math.floor((window.innerWidth * window.innerHeight) / density);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      const maxDist = 120;
      const maxDistSq = maxDist * maxDist;
      const isLight = theme === "light";

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const pA = particles[a];
          const pB = particles[b];

          const dx = pA.x - pB.x;
          const dy = pA.y - pB.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            // If either particle is being pushed, suppress the line
            const maxPush = Math.max(pA.pushRatio, pB.pushRatio);

            // Lines fade out as particles get pushed (break on interaction)
            const breakFactor = Math.max(0, 1 - maxPush * 2.5);
            if (breakFactor <= 0) continue; // fully broken — skip drawing

            const baseOpacity = isLight ? 0.22 : 0.20; // dark mode line opacity boosted
            const lineOpacity = (1 - dist / maxDist) * baseOpacity * breakFactor;

            ctx.beginPath();
            ctx.strokeStyle = isLight
              ? `rgba(26, 95, 122, ${lineOpacity.toFixed(3)})`
              : `rgba(36, 177, 177, ${lineOpacity.toFixed(3)})`;
            ctx.lineWidth = isLight ? 0.8 : 0.7; // dark mode line width boosted
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }
    };

    // Reduced mouse aura — very subtle ripple hint only
    const drawMouseAura = () => {
      if (mouse.x === -9999) return;
      const isLight = theme === "light";
      const grad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, mouse.radius * 0.7
      );
      // Lowered alpha: 0.07→0.025 (light), 0.06→0.020 (dark)
      grad.addColorStop(0, isLight
        ? "rgba(26, 95, 122, 0.025)"
        : "rgba(36, 177, 177, 0.020)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawMouseAura();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }

      connectParticles();

      animationFrameId = requestAnimationFrame(animate);
    };

    // Defer initialization slightly to let CSS transitions start smoothly
    const startTimeout = setTimeout(() => {
      resize();
      animate();
    }, 50);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(startTimeout);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
