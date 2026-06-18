import { http, HttpResponse, type StrictRequest, type DefaultBodyType } from 'msw';

const GITHUB_API = 'https://api.github.com';

const mockCalendar = {
  totalContributions: 100,
  weeks: [
    {
      contributionDays: [
        { contributionCount: 3, date: '2024-06-10', color: '#ebedf0' },
        { contributionCount: 0, date: '2024-06-11', color: '#ebedf0' },
        { contributionCount: 5, date: '2024-06-12', color: '#40c463' },
      ],
    },
  ],
};

function extractBearerToken(request: StrictRequest<DefaultBodyType>): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export const handlers = [
  // GraphQL — contributions, contributed repos, pinned repos, popular repos, starred repos
  http.post(`${GITHUB_API}/graphql`, async ({ request }) => {
    const token = extractBearerToken(request);
    if (!token || token === '') {
      return HttpResponse.json({ message: 'Bad credentials' }, { status: 401 });
    }

    const body = await request.json();
    const query = (body as Record<string, unknown>)?.query as string | undefined;

    if (!query) {
      return HttpResponse.json({ message: 'Missing query' }, { status: 400 });
    }

    if (query.includes('contributionCalendar') || query.includes('contributionsCollection')) {
      return HttpResponse.json({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: mockCalendar,
              totalPullRequestContributions: 10,
              totalIssueContributions: 5,
              totalPullRequestReviewContributions: 8,
              commitContributionsByRepository: [
                {
                  repository: { nameWithOwner: 'octocat/hello-world' },
                  contributions: { totalCount: 25 },
                },
              ],
            },
          },
        },
      });
    }

    if (query.includes('repositoriesContributedTo')) {
      return HttpResponse.json({
        data: {
          user: {
            repositoriesContributedTo: {
              nodes: [
                {
                  nameWithOwner: 'octocat/hello-world',
                  description: 'Test repo',
                  stargazerCount: 100,
                },
              ],
            },
          },
        },
      });
    }

    if (query.includes('pinnedItems')) {
      return HttpResponse.json({
        data: {
          user: {
            pinnedItems: {
              nodes: [
                {
                  __typename: 'Repository',
                  nameWithOwner: 'octocat/hello-world',
                  description: 'Test repo',
                  stargazerCount: 100,
                  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
                },
              ],
            },
          },
        },
      });
    }

    if (query.includes('repositories') && query.includes('STARGAZERS')) {
      return HttpResponse.json({
        data: {
          user: {
            repositories: {
              nodes: [
                {
                  nameWithOwner: 'octocat/popular-repo',
                  description: 'Popular repo',
                  stargazerCount: 500,
                  primaryLanguage: { name: 'TypeScript', color: '#3178c6' },
                },
              ],
            },
          },
        },
      });
    }

    if (query.includes('starredRepositories')) {
      return HttpResponse.json({
        data: {
          user: {
            starredRepositories: {
              nodes: [
                {
                  nameWithOwner: 'octocat/starred-repo',
                  description: 'Starred repo',
                  stargazerCount: 200,
                  primaryLanguage: { name: 'JavaScript', color: '#f1e05a' },
                },
              ],
            },
          },
        },
      });
    }

    return HttpResponse.json({ data: {} });
  }),

  // REST — user profile
  http.get(`${GITHUB_API}/users/:username`, ({ params }) => {
    const { username } = params;
    if (username === 'notfound') {
      return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return HttpResponse.json({
      login: username,
      name: 'Test User',
      bio: 'Test bio',
      company: 'Test Co',
      location: 'Test City',
      blog: 'https://example.com',
      twitter_username: 'testuser',
      public_repos: 10,
      followers: 100,
      following: 50,
      created_at: '2010-01-01T00:00:00Z',
    });
  }),

  // REST — user repos
  http.get(`${GITHUB_API}/users/:username/repos`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = parseInt(url.searchParams.get('per_page') || '100', 10);

    const repos = Array.from({ length: Math.min(perPage, 3) }, (_, i) => ({
      name: `repo-${page}-${i}`,
      full_name: `octocat/repo-${page}-${i}`,
      description: `Test repo ${i}`,
      language: 'TypeScript',
      stargazers_count: i * 10,
      forks_count: i * 2,
      open_issues_count: i,
      html_url: `https://github.com/octocat/repo-${page}-${i}`,
      updated_at: '2024-06-12T00:00:00Z',
    }));

    return HttpResponse.json(repos);
  }),

  // REST — org members
  http.get(`${GITHUB_API}/orgs/:org/members`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);

    if (page > 2) return HttpResponse.json([]);

    return HttpResponse.json([
      { login: 'member-1', avatar_url: 'https://example.com/avatar1.png' },
      { login: 'member-2', avatar_url: 'https://example.com/avatar2.png' },
    ]);
  }),

  // REST — workflow runs
  http.get(`${GITHUB_API}/repos/:owner/:repo/actions/runs`, () => {
    return HttpResponse.json({
      workflow_runs: [
        {
          id: 1,
          name: 'CI',
          status: 'completed',
          conclusion: 'success',
          head_branch: 'main',
          created_at: '2024-06-12T00:00:00Z',
          updated_at: '2024-06-12T01:00:00Z',
        },
      ],
    });
  }),

  // REST — deployments
  http.get(`${GITHUB_API}/repos/:owner/:repo/deployments`, () => {
    return HttpResponse.json([
      { id: 1, environment: 'production', sha: 'abc123', created_at: '2024-06-12T00:00:00Z' },
    ]);
  }),

  // REST — deployment statuses
  http.get(`${GITHUB_API}/repos/:owner/:repo/deployments/:id/statuses`, () => {
    return HttpResponse.json([{ id: 1, state: 'success', created_at: '2024-06-12T01:00:00Z' }]);
  }),

  // Catch-all for unhandled requests
  http.all(`${GITHUB_API}/*`, ({ request }) => {
    console.warn(`[MSW] Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json({ message: 'Unhandled request' }, { status: 501 });
  }),
];
