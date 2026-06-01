"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { GitHubRepo } from "@/lib/github";
import { getLanguageColor } from "@/lib/github";
import styles from "./Projects.module.css";
import ScrollReveal from "./ScrollReveal";

interface ProjectsProps {
  repos: GitHubRepo[];
}

const OWNER = "Teramoto669";

const PINNED_REPOS = ["Web-Aonime", "anikoto-scrap-api", "teramoto-web"];

const CUSTOM_DESCRIPTIONS: Record<string, string> = {
  "Web-Aonime": "A modern web application for streaming and discovering anime, built with TypeScript.",
  "anikoto-scrap-api": "An API for scraping and organizing anime data from various sources.",
  "teramoto-web": "My Own Portfolio, where this website you're currently visiting, built with TypeScript and Next.js.",
};

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
  );
}

export default function Projects({ repos }: ProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbVersion, setThumbVersion] = useState(0);
  const [pages, setPages] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sort pinned repos to the top
  const sortedRepos = [...repos].sort((a, b) => {
    const aPinned = PINNED_REPOS.includes(a.name);
    const bPinned = PINNED_REPOS.includes(b.name);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  useEffect(() => {
    const calculatePages = () => {
      if (!scrollRef.current) return;
      const containerWidth = scrollRef.current.clientWidth;
      const childCount = scrollRef.current.children.length;
      if (childCount === 0) return;

      const firstChild = scrollRef.current.children[0] as HTMLElement;
      // Get the exact width including the gap by measuring offset difference
      const cardWidth = childCount > 1
        ? (scrollRef.current.children[1] as HTMLElement).offsetLeft - firstChild.offsetLeft
        : firstChild.offsetWidth + 24;

      // How many cards fit perfectly in the viewport?
      // Math.round prevents fractional sub-pixel scrollbars from turning 2 into 1.
      const cardsPerView = Math.max(1, Math.round(containerWidth / cardWidth));

      // Calculate how many pages we need
      const totalPages = Math.ceil(childCount / cardsPerView);

      const newPages = [];
      for (let i = 0; i < totalPages; i++) {
        newPages.push(i * cardsPerView);
      }
      setPages(newPages);

      // Re-align scroll position to nearest valid page
      const scrollLeft = scrollRef.current.scrollLeft;
      let closestPageIdx = 0;
      let minDiff = Infinity;

      newPages.forEach((startIndex, idx) => {
        const pageScrollPos = startIndex * cardWidth;
        const diff = Math.abs(scrollLeft - pageScrollPos);
        if (diff < minDiff) {
          minDiff = diff;
          closestPageIdx = idx;
        }
      });

      setActiveIndex(closestPageIdx);

      // Snap to the aligned position without animation during resize
      scrollRef.current.scrollTo({
        left: newPages[closestPageIdx] * cardWidth,
        behavior: "auto"
      });
    };

    calculatePages();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        calculatePages();
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [sortedRepos.length]);

  // Auto-refresh thumbnails every 3 hours
  useEffect(() => {
    const THREE_HOURS = 24 * 60 * 60 * 1000;
    const id = setInterval(() => {
      setThumbVersion((v) => v + 1);
    }, THREE_HOURS);

    return () => clearInterval(id);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current || pages.length === 0) return;
    const scrollLeft = scrollRef.current.scrollLeft;

    let closestPageIdx = 0;
    let minDiff = Infinity;

    const firstChild = scrollRef.current.children[0] as HTMLElement;
    const childCount = scrollRef.current.children.length;
    const cardWidth = childCount > 1
      ? (scrollRef.current.children[1] as HTMLElement).offsetLeft - firstChild.offsetLeft
      : firstChild.offsetWidth + 24;

    pages.forEach((startIndex, idx) => {
      const pageScrollPos = startIndex * cardWidth;
      const diff = Math.abs(scrollLeft - pageScrollPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestPageIdx = idx;
      }
    });

    // If we scrolled to the absolute right end, select the last dot
    if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth - 10) {
      closestPageIdx = pages.length - 1;
    }

    setActiveIndex(closestPageIdx);
  };

  const scrollTo = (pageIndex: number) => {
    if (!scrollRef.current || pages.length === 0) return;
    const startIndex = pages[pageIndex];
    const child = scrollRef.current.children[startIndex] as HTMLElement;

    if (child) {
      child.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    }
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className={styles.header}>
          <ScrollReveal animation="up">
            <p className="section-label">Selected Works</p>
            <h2 className="section-title">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="section-subtitle">
              A curated list of my open-source tools, scripts, and web apps.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="left" delay={100}>
            <a
              href={`https://github.com/${OWNER}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              aria-label="View all repositories on GitHub"
            >
              All Repos
              <ExternalIcon />
            </a>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="scale" delay={200}>
          <div className={styles.sliderWrap}>

            {sortedRepos.length === 0 ? (
              <p className={styles.empty}>No public repositories found.</p>
            ) : (
              <div className={styles.carouselWrap}>
                <div
                  className={styles.grid}
                  role="list"
                  ref={scrollRef}
                  onScroll={handleScroll}
                >
                  {sortedRepos.map((repo, index) => {
                    const isPinned = PINNED_REPOS.includes(repo.name);

                    return (
                      <article key={repo.id} className={`card ${styles.repoCard} ${isPinned ? styles.pinnedCard : ""}`} role="listitem">

                        {/* ── Preview Image ── */}
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.previewLink}
                          aria-label={`Open ${repo.name} on GitHub`}
                          tabIndex={-1}
                        >
                          <div className={styles.previewWrap}>
                            {isPinned && (
                              <div className={styles.pinnedBadge}>
                                <PinIcon /> Pinned
                              </div>
                            )}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={(() => {
                                const base = repo.homepage
                                  ? `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(
                                    repo.homepage.startsWith("http") ? repo.homepage : `https://${repo.homepage}`
                                  )}?w=600&h=300`
                                  : `https://opengraph.githubassets.com/1/${OWNER}/${repo.name}`;
                                return base.includes("?") ? `${base}&v=${thumbVersion}` : `${base}?v=${thumbVersion}`;
                              })()}
                              alt={`Preview of ${repo.name}`}
                              className={styles.previewImg}
                              loading={index < 2 ? "eager" : "lazy"}
                            />
                            <div className={styles.previewOverlay} aria-hidden="true">
                              <span className={styles.previewViewBtn}>
                                <ExternalIcon /> View Repo
                              </span>
                            </div>
                          </div>
                        </a>

                        {/* ── Body ── */}
                        <div className={styles.body}>
                          {/* Header */}
                          <div className={styles.repoHeader}>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.repoName}
                              aria-label={`Open ${repo.name} on GitHub`}
                            >
                              {repo.name}
                            </a>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.extLink}
                              aria-label="Open in new tab"
                            >
                              <ExternalIcon />
                            </a>
                          </div>

                          {/* Description */}
                          <p className={styles.repoDesc}>
                            {repo.description || CUSTOM_DESCRIPTIONS[repo.name] || "No description provided."}
                          </p>

                          {/* Topics */}
                          {repo.topics && repo.topics.length > 0 && (
                            <div className={styles.topics} aria-label="Topics">
                              {repo.topics.slice(0, 3).map((t) => (
                                <span key={t} className={`badge ${styles.topic}`}>{t}</span>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className={styles.repoFooter}>
                            <div className={styles.repoStats}>
                              {repo.language && (
                                <span className={styles.lang}>
                                  <span
                                    className={styles.langDot}
                                    style={{ background: getLanguageColor(repo.language) }}
                                    aria-hidden="true"
                                  />
                                  {repo.language}
                                </span>
                              )}
                              <span className={styles.statItem} aria-label={`${repo.stargazers_count} stars`}>
                                <StarIcon /> {repo.stargazers_count}
                              </span>
                              <span className={styles.statItem} aria-label={`${repo.forks_count} forks`}>
                                <ForkIcon /> {repo.forks_count}
                              </span>
                            </div>
                            {repo.homepage && (
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.liveLink}
                                aria-label={`Live demo of ${repo.name}`}
                              >
                                Live ↗
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {pages.length > 1 && (
                  <div className={styles.paginationContainer}>
                    <button
                      className={styles.arrowBtn}
                      onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
                      disabled={activeIndex === 0}
                      aria-label="Previous page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>

                    <div className={styles.pagination}>
                      {pages.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                          onClick={() => scrollTo(i)}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      className={styles.arrowBtn}
                      onClick={() => scrollTo(Math.min(pages.length - 1, activeIndex + 1))}
                      disabled={activeIndex === pages.length - 1}
                      aria-label="Next page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
