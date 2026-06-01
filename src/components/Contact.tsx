import styles from "./Contact.module.css";
import ScrollReveal from "./ScrollReveal";

const CONTACT_LINKS = [
  {
    id: "github-link",
    label: "GitHub",
    handle: "@Teramoto669",
    href: "https://github.com/Teramoto669",
    description: "Check out my repositories and open source work",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: "#e8f4fd",
  },
  {
    id: "email-link",
    label: "Email",
    handle: "Send me a message",
    href: "mailto:rezhashahidzindarb@gmail.com",
    description: "Got a project in mind? Let's talk",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    color: "#4BB8FA",
  },
  {
    id: "instagram-link",
    label: "Instagram",
    handle: "@rezhashahhh",
    href: "https://instagram.com/rezhashahhh",
    description: "Follow my creative journey and daily life",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "#E1306C",
  },
];

export default function Contact() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className="container">
        {/* Header */}
        <div className={styles.head}>
          <ScrollReveal animation="up">
            <p className="section-label">Contact</p>
            <h2 className="section-title">
              Let&apos;s <span className="gradient-text">Connect</span>
            </h2>
            <p className="section-subtitle">
              Whether you have a project idea, a question, or just want to say hi —
              my inbox is always open.
            </p>
          </ScrollReveal>
        </div>

        {/* Contact Cards */}
        <div className={styles.cards} role="list">
          {CONTACT_LINKS.map(({ id, label, handle, href, description, icon, color }, i) => (
            <ScrollReveal key={id} animation="up" delay={i * 150}>
              <a
                id={id}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className={`card ${styles.contactCard}`}
                aria-label={`${label}: ${handle}`}
                role="listitem"
              >
                <div
                  className={styles.contactIcon}
                  style={{ color }}
                  aria-hidden="true"
                >
                  {icon}
                </div>
                <div className={styles.contactInfo}>
                  <p className={styles.contactLabel}>{label}</p>
                  <p className={styles.contactHandle}>{handle}</p>
                  <p className={styles.contactDesc}>{description}</p>
                </div>
                <div className={styles.arrow} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* Divider */}
        <div className="divider" style={{ margin: "3rem 0 2rem" }} />

        {/* Bottom */}
        <ScrollReveal animation="up" delay={400}>
          <div className={styles.bottom}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} Rezha Shahidzinda. Crafted with{" "}
              <span aria-label="love">❤️</span> and Next.js.
            </p>
            <a
              href="https://github.com/Teramoto669"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ghLink}
              aria-label="View source on GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Teramoto669
            </a>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
