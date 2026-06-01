import styles from "./About.module.css";
import ScrollReveal from "./ScrollReveal";

const SKILLS = [
  { name: "Python",     icon: "🐍", category: "Language" },
  { name: "TypeScript", icon: "🔷", category: "Language" },
  { name: "C#",         icon: "⚙️",  category: "Language" },
  { name: "Kotlin",     icon: "🟣", category: "Language" },
  { name: "Dart",       icon: "💙", category: "Language" },
  { name: "Next.js",    icon: "▲",  category: "Framework" },
  { name: "Vite",       icon: "⚡", category: "Framework" },
  { name: "Flutter",    icon: "🦋", category: "Framework" },
];

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
                Hello! I am <strong>Rezha</strong>, an informatics engineering student 
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
            <div className={styles.skillGrid}>
              {SKILLS.map((skill, index) => (
                <ScrollReveal key={skill.name} animation="scale" delay={500 + index * 50}>
                  <div className={styles.skillCard} title={`${skill.name} - ${skill.category}`}>
                    <div className={styles.skillIcon} aria-hidden="true">
                      {skill.icon}
                    </div>
                    <div className={styles.skillInfo}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillCategory}>{skill.category}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
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
