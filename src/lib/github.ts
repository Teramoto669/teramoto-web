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
  id: number | string;
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

async function getContributedRepos(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        repositoriesContributedTo(first: 20, contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY], includeUserRepositories: false, orderBy: {field: STARGAZERS, direction: DESC}) {
          nodes {
            id
            name
            nameWithOwner
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
            }
            repositoryTopics(first: 5) {
              nodes {
                topic {
                  name
                }
              }
            }
            updatedAt
            homepageUrl
            isFork
            isArchived
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }
    });

    if (!res.ok) return [];

    const json = await res.json();
    const nodes = json.data?.user?.repositoriesContributedTo?.nodes || [];

    return nodes.map((node: any) => ({
      id: node.id,
      name: node.name,
      full_name: node.nameWithOwner,
      description: node.description,
      html_url: node.url,
      stargazers_count: node.stargazerCount,
      forks_count: node.forkCount,
      language: node.primaryLanguage?.name || null,
      topics: node.repositoryTopics?.nodes?.map((n: any) => n.topic.name) || [],
      updated_at: node.updatedAt,
      homepage: node.homepageUrl,
      fork: node.isFork,
      archived: node.isArchived,
      watchers_count: 0
    }));
  } catch (e) {
    console.error("Failed to fetch contributed repos via GraphQL:", e);
    return [];
  }
}

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
  
  let repos: GitHubRepo[] = await res.json();

  // Fetch contributed repos automatically via GraphQL
  const contributedRepos = await getContributedRepos();
  
  // Filter duplicates by id just in case
  const existingIds = new Set(repos.map(r => r.id));
  for (const cr of contributedRepos) {
    if (!existingIds.has(cr.id)) {
      repos.push(cr);
    }
  }

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
