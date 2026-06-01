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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * -0.5 - 0.1; // Float slowly upwards
        this.opacity = Math.random() * 0.5 + 0.1;
        
        // Brand color palette based on theme
        const isLight = theme === "light";
        const colors = isLight
          ? [
              "rgba(53, 133, 142, OPACITY)", // Dark Teal
              "rgba(125, 167, 140, OPACITY)", // Muted Green
              "rgba(194, 208, 153, OPACITY)"  // Light Green
            ]
          : [
              "rgba(36, 177, 177, OPACITY)", // Accent (Bright Teal)
              "rgba(0, 121, 121, OPACITY)", // Secondary (Dark Teal)
              "rgba(255, 240, 228, OPACITY)"   // Primary Light (Peach)
            ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas!.width) this.x = 0;
        else if (this.x < 0) this.x = canvas!.width;
        
        if (this.y < 0) this.y = canvas!.height;

        this.draw();
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace("OPACITY", this.opacity.toString());
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size (1 particle per 12000px^2)
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 12000); 
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connect particles with lines if they are close enough
          if (distance < 110) {
            const opacityValue = (1 - distance / 110) * 0.12; // Very subtle lines
            ctx.beginPath();
            ctx.strokeStyle = theme === "light" 
              ? `rgba(53, 133, 142, ${opacityValue})`
              : `rgba(36, 177, 177, ${opacityValue})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      
      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
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
        zIndex: 0, // Behind main content
      }}
      aria-hidden="true"
    />
  );
}
