import { getInput, setFailed, setOutput } from '@actions/core';

import { isPullRequest, pullRequestDetails } from './pull-requests';

export async function run() {
  try {
    const token = getInput('repo_token', { required: true });

    if (!(await isPullRequest(token))) {
      throw new Error('Comment is not on a pull request');
    }

    const { baseRef, baseSha, headRef, headSha } = await pullRequestDetails(token);

    setOutput('base_ref', baseRef);
    setOutput('base_sha', baseSha);
    setOutput('head_ref', headRef);
    setOutput('head_sha', headSha);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      throw error;
    }
  }
}

await run();
