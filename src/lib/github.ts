export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
  blog: string;
  company: string;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  watchers_count: number;
}

const GITHUB_USERNAME = "Teramoto669";
const BASE_URL = "https://api.github.com";

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export async function getGitHubUser(): Promise<GitHubUser> {
  const res = await fetch(`${BASE_URL}/users/${GITHUB_USERNAME}`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch GitHub user");
  return res.json();
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${BASE_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  const repos: GitHubRepo[] = await res.json();
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 9);
}

export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    Python: "#3572A5",
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    "C#": "#178600",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Vue: "#41b883",
    Go: "#00ADD8",
    Rust: "#dea584",
    Java: "#b07219",
    Swift: "#fa7343",
    Ruby: "#701516",
    PHP: "#4F5D95",
  };
  return colors[language ?? ""] ?? "#8b8b8b";
}

export const GITHUB_USERNAME_EXPORT = GITHUB_USERNAME;
