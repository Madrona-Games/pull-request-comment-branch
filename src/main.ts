import { getInput, setFailed, setOutput } from '@actions/core';

import { isPullRequest, pullRequestDetails } from './pull-requests';

export async function run() {
  try {
    const token = getInput('repo-token', { required: true });

    if (!(await isPullRequest(token))) {
      throw new Error('Comment is not on a pull request');
    }

    const { baseRef, baseSha, headRef, headSha } = await pullRequestDetails(token);

    setOutput('base-ref', baseRef);
    setOutput('base-sha', baseSha);
    setOutput('head-ref', headRef);
    setOutput('head-sha', headSha);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      throw error;
    }
  }
}

await run();
