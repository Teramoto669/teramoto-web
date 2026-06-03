import { Suspense } from "react";
import { getGitHubUser, getGitHubRepos } from "@/lib/github";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import GitHubStats from "@/components/GitHubStats";
import Contact from "@/components/Contact";

export const revalidate = 1800; // Revalidate every hour

export default async function Home() {
  const [user, repos] = await Promise.all([
    getGitHubUser(),
    getGitHubRepos(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={null}>
          <Hero user={user} />
        </Suspense>

        <About />

        <Suspense fallback={<div style={{ height: "40rem" }} />}>
          <Projects repos={repos} />
        </Suspense>

        <Suspense fallback={<div style={{ height: "40rem" }} />}>
          <GitHubStats user={user} />
        </Suspense>
      </main>

      <Contact />
    </>
  );
}
