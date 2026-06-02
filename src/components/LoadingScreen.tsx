"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LoadingScreen.module.css";

/* ── Theme palette ────────────────────────────────────────── */
const PALETTE = {
  dark: {
    bg: "#001818",
    particle: "36,177,177",   // teal
    accent: "#24b1b1",
    accentGrad: "#007979",
    text: "#FFF0E4",
    subtitle: "#24b1b1",
    barBg: "rgba(36,177,177,0.12)",
    corner: "rgba(36,177,177,0.45)",
    hint: "rgba(255,240,228,0.5)",
  },
  light: {
    bg: "#E6EEC9",
    particle: "53,133,142",   // muted teal-green
    accent: "#35858E",
    accentGrad: "#7DA78C",
    text: "#1a2e30",
    subtitle: "#35858E",
    barBg: "rgba(53,133,142,0.15)",
    corner: "rgba(53,133,142,0.5)",
    hint: "rgba(26,46,48,0.5)",
  },
} as const;

type ThemeKey = keyof typeof PALETTE;

/* ── Particle canvas ──────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  particleColor: string,  // "r,g,b"
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const COUNT = 80;
    const MAX_DIST = 140;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor},${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const opacity = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColor},${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
    // particleColor is stable per mount — intentionally omit to avoid restart
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);
}

/* ── Component ────────────────────────────────────────────── */
export default function LoadingScreen() {
  const [phase, setPhase] = useState<"loading" | "ready" | "exiting" | "done">("loading");
  const [themeKey, setThemeKey] = useState<ThemeKey>("dark");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Read theme from data-theme attribute (set by inline script before hydration)
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setThemeKey(attr === "light" ? "light" : "dark");
  }, []);

  const p = PALETTE[themeKey];
  useParticleCanvas(canvasRef, p.particle);

  useEffect(() => {
    const timer = setTimeout(() => setPhase("ready"), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    if (phase !== "ready") return;

    if (!audioRef.current) {
      const audio = new Audio("/bgm.mp3");
      audio.loop = true;
      audio.volume = 0.9;
      audioRef.current = audio;
    }
    audioRef.current.play().catch(() => { });

    (window as unknown as Record<string, unknown>).__bgmAudio = audioRef.current;
    window.dispatchEvent(new CustomEvent("bgm:start"));

    setPhase("exiting");
    setTimeout(() => setPhase("done"), 800);
  };

  if (phase === "done") return null;

  return (
    <div
      className={`${styles.overlay} ${phase === "exiting" ? styles.exit : ""}`}
      onClick={handleEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleEnter()}
      aria-label="Click to enter"
      style={{ background: p.bg } as React.CSSProperties}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Vignette — adapts per theme */}
      <div
        className={styles.vignette}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, ${p.bg}99 100%)`,
        }}
      />

      {/* Center content */}
      <div className={styles.center}>
        {/* Logo / name */}
        <div className={styles.logoWrap}>
          <span
            className={styles.logoLine}
            style={{ background: `linear-gradient(90deg, transparent, ${p.accent})` }}
          />
          <h1 className={styles.name}>
            {(phase === "loading" ? "Loading" : "Complete").split("").map((c, i) => (
              <span
                key={phase === "loading" ? `load-${i}` : `done-${i}`}
                style={{
                  animationDelay: `${i * 0.07}s`,
                  backgroundImage: `linear-gradient(135deg, ${p.text} 0%, ${p.accent} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {c}
              </span>
            ))}
          </h1>
          <span
            className={styles.logoLine}
            style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)` }}
          />
        </div>

        <p className={styles.subtitle} style={{ color: p.subtitle }}>Portfolio</p>

        {/* Loading bar */}
        <div
          className={`${styles.barWrap} ${phase === "ready" ? styles.barDone : ""}`}
          style={{ background: p.barBg }}
        >
          <div
            className={styles.bar}
            style={{ background: `linear-gradient(90deg, ${p.accentGrad}, ${p.accent})` }}
          />
        </div>

        {/* Click to enter prompt */}
        <p
          className={`${styles.enterHint} ${phase === "ready" ? styles.hintVisible : ""}`}
          style={{ color: p.hint }}
        >
          Click anywhere to enter
        </p>
      </div>

      {/* Corner decorations */}
      <span className={`${styles.corner} ${styles.tl}`} style={{ borderColor: p.corner }} />
      <span className={`${styles.corner} ${styles.tr}`} style={{ borderColor: p.corner }} />
      <span className={`${styles.corner} ${styles.bl}`} style={{ borderColor: p.corner }} />
      <span className={`${styles.corner} ${styles.br}`} style={{ borderColor: p.corner }} />
    </div>
  );
}
