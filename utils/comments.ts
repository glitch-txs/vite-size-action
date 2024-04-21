import type { getOctokit } from '@actions/github'

export const VITE_SIZE_HEADING = `# ♻️ Vite-Size ♻️`;

export async function fetchPreviousComment(
  octokit: ReturnType<typeof getOctokit>,
  repo: { owner: string; repo: string },
  pr: { number: number, [key: string]: any }
) {
  const commentList = await octokit.paginate(
    "GET /repos/:owner/:repo/issues/:issue_number/comments",
    {
      ...repo,
      issue_number: pr.number
    }
  );

  const viteSizeComment = commentList.find(comment =>
    (comment as { body: string }).body.startsWith(VITE_SIZE_HEADING)
  );
  return viteSizeComment
}