import Image from "next/image";
import type { GitHubUser } from "@/lib/github";
import styles from "./Hero.module.css";
import ScrollReveal from "./ScrollReveal";

const SKILLS_PREVIEW = [
  "Python", "Next.js", "TypeScript", "C#", "Kotlin", "Flutter", "Vite",
];

interface HeroProps {
  user: GitHubUser;
}

export default function Hero({ user }: HeroProps) {
  return (
    <section id="hero" className={styles.hero}>

      <div className={`container ${styles.inner}`}>
        {/* Avatar */}
        <div className={styles.avatarWrap}>
          <ScrollReveal animation="scale">
            <div className={styles.avatarRing} aria-hidden="true" />
            <div className={styles.avatarGlow} aria-hidden="true" />
            <Image
              src={user.avatar_url}
              alt={`${user.name ?? user.login} avatar`}
              width={160}
              height={160}
              className={styles.avatar}
              priority
            />
            <span className={styles.onlineDot} aria-label="Online" />
          </ScrollReveal>
        </div>

        {/* Text */}
        <div className={styles.content}>

          <ScrollReveal animation="up" delay={100}>
            <h1 className={`${styles.name}`}>
              Rezha Shahidzinda
            </h1>
            <p className={styles.tagline}>
              Informatics Engineering Student
              <span className={styles.dot}> · </span>
              <span className={styles.modder}>Modder</span>
            </p>
          </ScrollReveal>

          <ScrollReveal animation="up" delay={200}>
            <p className={styles.bio}>
              Passionate about building clean, performant software and
              customizing digital experiences — from web apps to game mods.
            </p>
          </ScrollReveal>

          {/* Tech pills */}
          <div className={styles.pills} role="list" aria-label="Technologies">
            {SKILLS_PREVIEW.map((s, i) => (
              <ScrollReveal key={s} animation="scale" delay={300 + i * 50}>
                <span className={`badge ${styles.pill}`} role="listitem">
                  {s}
                </span>
              </ScrollReveal>
            ))}
          </div>

          {/* CTAs */}
          <ScrollReveal animation="up" delay={500}>
            <div className={styles.actions}>
              <a href="#projects" className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                View Projects
              </a>
              <a href="#contact" className="btn btn-ghost">
                Let&apos;s Connect
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </ScrollReveal>

          {/* Stats strip */}
          <ScrollReveal animation="up" delay={600}>
            <div className={styles.statsStrip} role="list" aria-label="GitHub statistics">
              {[
                { label: "Repositories", value: user.public_repos },
                { label: "Followers", value: user.followers },
                { label: "Following", value: user.following },
              ].map(({ label, value }) => (
                <div key={label} className={styles.stat} role="listitem">
                  <span className={styles.statVal}>{value}</span>
                  <span className={styles.statLbl}>{label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

    </section>
  );
}
