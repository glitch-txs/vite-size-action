import * as core from '@actions/core'
import * as github from '@actions/github'
import { VITE_SIZE_HEADING, fetchPreviousComment } from './utils/comments.js'
import { calcDiff, exec_vite_size } from './utils/script.js'
import { markdownTable } from 'markdown-table'

try {
  const { payload, repo } = github.context
  const pr = payload.pull_request

  if (!pr) {
    throw new Error('No PR found. Only pull_request workflows are supported.')
  }
  
  const { status, size_values } = await exec_vite_size()
  const { size_values: base_size_values } = await exec_vite_size({ branch: pr.base.ref })
  const { diff_size_values } = calcDiff({ current: size_values, base: base_size_values })

  if (status > 0) {
    core.setFailed('Error while executing vite-size script.');
  }

  const body = [
    VITE_SIZE_HEADING,
    "### Size Difference",
    markdownTable(diff_size_values as string[][] || []),
    "### Current Size",
    markdownTable(size_values as string[][] || []),
    "### Base Size",
    markdownTable(base_size_values as string[][] || [])
  ].join('\r\n')


  const token = core.getInput('github_token', { required: true })
  const octokit = github.getOctokit(token)

  const viteSizeComment = await fetchPreviousComment(octokit, repo, pr)

  if (!viteSizeComment) {
    try {
      await octokit.rest.issues.createComment({
        ...repo,
        issue_number: pr.number,
        body
      });
    } catch (error) {
      core.error("Error creating comment.");
    }
  } else {
    try {
      await octokit.rest.issues.updateComment({
        ...repo,
        comment_id: (viteSizeComment as { id: number }).id,
        body
      });
    } catch (error) {
      core.error("Error updating comment.");
    }
  }
} catch (error) {
  core.setFailed((error as Error).message)
}
