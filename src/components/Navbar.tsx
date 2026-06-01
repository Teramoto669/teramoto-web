"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub Stats", href: "#stats" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [bgmMuted, setBgmMuted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const { theme, toggleTheme } = useTheme();

  // ── Real audio visualizer setup ───────────────────────────
  useEffect(() => {
    const handleBgmStart = () => {
      const audio = (window as unknown as Record<string, unknown>).__bgmAudio as HTMLAudioElement | undefined;
      if (!audio) return;
      bgmRef.current = audio;
      setBgmPlaying(true);

      // Build Web Audio graph (only once)
      if (analyserRef.current) return;
      try {
        const AudioCtx = window.AudioContext ||
          (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext;
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;          // 32 frequency bins — plenty for 4 bands
        analyser.smoothingTimeConstant = 0.75;
        analyserRef.current = analyser;

        const source = ctx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        // RAF draw loop
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const BANDS = [
          [0,  2],   // sub-bass
          [2,  5],   // bass
          [5,  9],   // low-mid
          [9,  14],  // mid
          [14, 20],  // upper-mid
          [20, 32],  // high
        ] as const;

        const draw = () => {
          animFrameRef.current = requestAnimationFrame(draw);
          const canvas = canvasRef.current;
          if (!canvas) return;
          const canvasCtx = canvas.getContext("2d");
          if (!canvasCtx) return;

          analyser.getByteFrequencyData(dataArray);

          const W = canvas.width;
          const H = canvas.height;
          canvasCtx.clearRect(0, 0, W, H);

          const BAR_W = 2;
          const GAP = 1;
          const totalW = BAR_W * 6 + GAP * 5;
          const startX = (W - totalW) / 2;

          BANDS.forEach(([lo, hi], i) => {
            // Average of the band's bins
            let sum = 0;
            for (let b = lo; b < hi; b++) sum += dataArray[b];
            const avg = sum / (hi - lo);
            const barH = Math.max(2, (avg / 255) * H);

            const x = startX + i * (BAR_W + GAP);
            const y = H - barH;

            // Read bar color from CSS variable so it follows the current theme
            const barColor = getComputedStyle(document.documentElement)
              .getPropertyValue("--text-secondary").trim() || "#24b1b1";

            canvasCtx.fillStyle = barColor;
            canvasCtx.beginPath();
            if (canvasCtx.roundRect) {
              canvasCtx.roundRect(x, y, BAR_W, barH, 1);
            } else {
              canvasCtx.rect(x, y, BAR_W, barH);
            }
            canvasCtx.fill();
          });
        };
        draw();
      } catch {
        // Web Audio not available — fallback to CSS animation (keep vizBars)
      }
    };

    window.addEventListener("bgm:start", handleBgmStart);
    return () => {
      window.removeEventListener("bgm:start", handleBgmStart);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const toggleBgm = () => {
    if (!bgmRef.current) return;
    if (bgmMuted) {
      bgmRef.current.muted = false;
      setBgmMuted(false);
    } else {
      bgmRef.current.muted = true;
      setBgmMuted(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      let current = sections[0]; // Default to first section (Home)

      if (window.scrollY < 100) {
        // Guaranteed to be Home at the very top, avoiding image load height shifts on mount
        current = "hero";
      } else {
        const scrollPos = window.scrollY + window.innerHeight / 3;
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollPos) {
            current = id;
          }
        }

        // If at the absolute bottom, select the last section
        if (window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 50) {
          current = sections[sections.length - 1];
        }
      }

      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        {/* Desktop Links */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <button
                className={`${styles.link} ${activeSection === href.slice(1) ? styles.linkActive : ""}`}
                onClick={() => handleNavClick(href)}
                aria-current={activeSection === href.slice(1) ? "location" : undefined}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.navActions}>
          {bgmPlaying && (
            <button
              onClick={toggleBgm}
              className={`${styles.themeToggle} ${styles.bgmBtn}`}
              aria-label={bgmMuted ? "Unmute music" : "Mute music"}
              title={bgmMuted ? "Unmute music" : "Mute music"}
            >
              {bgmMuted ? (
                /* muted — static speaker-off icon */
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                /* playing — real-time canvas visualizer */
                <canvas
                  ref={canvasRef}
                  width={17}
                  height={14}
                  className={styles.vizCanvas}
                  aria-hidden="true"
                />
              )}
            </button>
          )}
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle} 
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {/* CTA */}
        <a
          href="https://github.com/Teramoto669"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
          aria-label="View GitHub profile"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        </div>
      </nav>

      </header>

      {/* Sidebar Backdrop */}
      <div 
        className={`${styles.sidebarBackdrop} ${menuOpen ? styles.backdropOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Sidebar */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`} aria-hidden={!menuOpen}>
        <div className={styles.sidebarHeader}>
          <p className={styles.sidebarTitle}>Menu</p>
          <button 
            className={styles.closeBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <ul role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <button
                className={`${styles.mobileLink} ${activeSection === href.slice(1) ? styles.mobileLinkActive : ""}`}
                onClick={() => handleNavClick(href)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.sidebarFooter}>
          <a
            href="https://github.com/Teramoto669"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.cta} ${styles.mobileCta}`}
          >
            View GitHub Profile
          </a>
        </div>
      </div>
    </>
  );
}
