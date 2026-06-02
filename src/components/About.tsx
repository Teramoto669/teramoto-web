import styles from "./About.module.css";
import ScrollReveal from "./ScrollReveal";
import {
  SiPython,
  SiTypescript,
  SiSharp,
  SiKotlin,
  SiDart,
  SiNextdotjs,
  SiVite,
  SiFlutter,
  SiJavascript,
  SiLaravel,
  SiPhp,
  SiCplusplus,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

const SKILLS = [
  { name: "JavaScript", icon: <SiJavascript size={20} aria-hidden="true" />, category: "Language" },
  { name: "TypeScript", icon: <SiTypescript size={20} aria-hidden="true" />, category: "Language" },
  { name: "Python", icon: <SiPython size={20} aria-hidden="true" />, category: "Language" },
  { name: "C++", icon: <SiCplusplus size={20} aria-hidden="true" />, category: "Language" },
  { name: "C#", icon: <SiSharp size={20} aria-hidden="true" />, category: "Language" },
  { name: "Java", icon: <FaJava size={20} aria-hidden="true" />, category: "Language" },
  { name: "Kotlin", icon: <SiKotlin size={20} aria-hidden="true" />, category: "Language" },
  { name: "PHP", icon: <SiPhp size={20} aria-hidden="true" />, category: "Language" },
  { name: "Dart", icon: <SiDart size={20} aria-hidden="true" />, category: "Language" },
  { name: "Laravel", icon: <SiLaravel size={20} aria-hidden="true" />, category: "Framework" },
  { name: "Next.js", icon: <SiNextdotjs size={20} aria-hidden="true" />, category: "Framework" },
  { name: "Vite", icon: <SiVite size={20} aria-hidden="true" />, category: "Framework" },
  { name: "Flutter", icon: <SiFlutter size={20} aria-hidden="true" />, category: "Framework" },
];

const ROW1 = SKILLS.slice(0, 7);
const ROW2 = SKILLS.slice(7);

const renderSkill = (skill: typeof SKILLS[0], index: number) => (
  <div key={`${skill.name}-${index}`} className={styles.skillCard} title={`${skill.name} - ${skill.category}`}>
    <div className={styles.skillIcon} aria-hidden="true">
      {skill.icon}
    </div>
    <div className={styles.skillInfo}>
      <span className={styles.skillName}>{skill.name}</span>
      <span className={styles.skillCategory}>{skill.category}</span>
    </div>
  </div>
);

const TOOLS = [
  "Git", "VS Code", "Figma", "Docker", "Linux", "Postman", "Firebase", "Vercel",
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        
        {/* Intro */}
        <div className={styles.aboutBlock}>
          <ScrollReveal animation="up">
            <p className="section-label">About Me</p>
            <h2 className="section-title">
              Crafting <span className="gradient-text">Experiences</span>
            </h2>
          </ScrollReveal>

          <div className={styles.prose}>
            <ScrollReveal animation="up" delay={100}>
              <p>
                Hello! I am <strong>Rezha</strong>, a Computer Science student 
                with an insatiable curiosity for how things work under the hood. My coding journey 
                began with tweaking games and building small automation scripts, which eventually 
                blossomed into a deep passion for full-stack software development.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={200}>
              <p>
                Beyond standard development, I am heavily involved in the <strong>modding community</strong>. 
                I enjoy reverse-engineering, building custom patches, and writing tools that enhance 
                user experiences in unique ways. This modder mindset—breaking things apart to build 
                them better—is exactly how I approach software architecture today.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={300}>
              <p>
                Whether it is building scalable web services, optimizing mobile apps, or creating 
                custom game tools, my goal is always to deliver clean code and highly performant solutions.
              </p>
            </ScrollReveal>
          </div>

          <div className={styles.toolsWrap}>
            <ScrollReveal animation="up" delay={400}>
              <p className={styles.toolsLabel}>Core Toolkit</p>
            </ScrollReveal>
            <ScrollReveal animation="up" delay={500}>
              <div className={styles.marqueeContainer}>
                <div className={styles.marqueeRow}>
                  <div className={styles.marqueeTrack}>
                    <div className={styles.marqueeGroup}>{ROW1.map(renderSkill)}</div>
                    <div className={styles.marqueeGroup}>{ROW1.map(renderSkill)}</div>
                  </div>
                </div>
                <div className={styles.marqueeRow}>
                  <div className={`${styles.marqueeTrack} ${styles.marqueeTrackSlow}`}>
                    <div className={styles.marqueeGroup}>{ROW2.map(renderSkill)}</div>
                    <div className={styles.marqueeGroup}>{ROW2.map(renderSkill)}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className={styles.toolsWrap}>
            <ScrollReveal animation="up" delay={600}>
              <p className={styles.toolsLabel}>Tools &amp; Ecosystem</p>
            </ScrollReveal>
            <div className={styles.tools}>
              {TOOLS.map((t, index) => (
                <ScrollReveal key={t} animation="scale" delay={700 + index * 50}>
                  <span className="badge">{t}</span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
