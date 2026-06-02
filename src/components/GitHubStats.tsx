"use client";

import type { GitHubUser } from "@/lib/github";
import { useTheme } from "./ThemeProvider";
import styles from "./GitHubStats.module.css";
import ScrollReveal from "./ScrollReveal";

interface GitHubStatsProps {
  user: GitHubUser;
}

const USERNAME = "Teramoto669";

export default function GitHubStats({ user }: GitHubStatsProps) {
  const { theme } = useTheme();
  const joinYear = new Date(user.created_at).getFullYear();
  const yearsOnGitHub = new Date().getFullYear() - joinYear;
  
  const isLight = theme === "light";
  
  // Dynamic API Colors
  const titleColor = isLight ? "35858E" : "24B1B1";
  const textColor = isLight ? "3b5a5e" : "FFE0C5";
  const iconColor = isLight ? "35858E" : "24B1B1";
  const datesColor = isLight ? "5e8185" : "6a9999";
  const sideNumsColor = isLight ? "1a2e30" : "FFF0E4";
  const borderColor = isLight ? "35858E4D" : "004d4d";

  // Cache buster dinamis: menggunakan tanggal dan blok 4-jam
  // Agar browser mengambil gambar terbaru lebih sering (mencegah out-of-sync antar tema)
  const cacheBuster = `${new Date().toISOString().split("T")[0]}-${Math.floor(new Date().getHours() / 4)}`;

  const statCards = [
    {
      label: "Public Repos",
      value: user.public_repos,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm6 4V7l5 5-5 5v-2H7V9h3z"/>
        </svg>
      ),
    },
    {
      label: "Followers",
      value: user.followers,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
    },
    {
      label: "Following",
      value: user.following,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
    },
    {
      label: "Years on GitHub",
      value: yearsOnGitHub,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="stats" className="section">
      <div className="container">
        <div className={styles.sectionHead}>
          <ScrollReveal animation="up">
            <p className="section-label">GitHub Activity</p>
            <h2 className="section-title">
              Stats &amp; <span className="gradient-text">Contributions</span>
            </h2>
            <p className="section-subtitle">
              A snapshot of my GitHub presence and development activity.
            </p>
          </ScrollReveal>
        </div>

        {/* Stat Cards */}
        <div className={styles.statCards} role="list" aria-label="GitHub statistics">
          {statCards.map(({ label, value, icon }, i) => (
            <ScrollReveal key={label} animation="up" delay={i * 100}>
              <div className={`card ${styles.statCard}`} role="listitem">
                <div className={styles.statIconWrap} aria-hidden="true">{icon}</div>
                <div className={styles.statValue}>{value}</div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* GitHub Stats Cards (readme-stats) */}
        <div className={styles.statsImages}>
          <ScrollReveal animation="scale" delay={200}>
            <div className={styles.statsImgWrap}>
              <h3 className={styles.imgTitle}>GitHub Stats</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github-readme-tera.vercel.app/api?username=${USERNAME}&show_icons=true&theme=transparent&title_color=${titleColor}&text_color=${textColor}&icon_color=${iconColor}&hide_border=true&border_radius=0&v=${cacheBuster}`}
                alt={`${user.name ?? USERNAME} GitHub stats`}
                className={styles.statsImg}
                loading="lazy"
                width={450}
                height={195}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={300}>
            <div className={styles.statsImgWrap}>
              <h3 className={styles.imgTitle}>Most Used Languages</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://github-readme-tera.vercel.app/api/top-langs/?username=${USERNAME}&layout=compact&theme=transparent&title_color=${titleColor}&text_color=${textColor}&icon_color=${iconColor}&langs_count=8&hide_border=true&border_radius=0&v=${cacheBuster}`}
                alt={`${user.name ?? USERNAME} most used languages`}
                className={styles.statsImg}
                loading="lazy"
                width={300}
                height={165}
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Contribution Graph */}
        <ScrollReveal animation="scale" delay={400}>
          <div className={styles.contribWrap}>
            <h3 className={styles.contribTitle}>Contribution Graph</h3>
            <div className={styles.contribCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ghchart.rshah.org/${titleColor}/${USERNAME}?v=${cacheBuster}`}
                alt={`${user.name ?? USERNAME} GitHub contribution chart`}
                className={`${styles.contribImg} ${!isLight ? styles.contribImgDark : ""}`}
                loading="lazy"
                width={800}
                height={120}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Streak Stats */}
        <ScrollReveal animation="scale" delay={500}>
          <div className={styles.streakWrap}>
            <h3 className={styles.imgTitle}>Streak Stats</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://streak-stats.demolab.com?user=${USERNAME}&theme=transparent&background=060d1a00&ring=${titleColor}&fire=${titleColor}&currStreakLabel=${titleColor}&sideNums=${sideNumsColor}&currStreakNum=${sideNumsColor}&sideLabels=${textColor}&dates=${datesColor}&border=${borderColor}&border_radius=0&v=${cacheBuster}`}
              alt={`${user.name ?? USERNAME} GitHub streak stats`}
              className={styles.streakImg}
              loading="lazy"
              width={495}
              height={195}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
