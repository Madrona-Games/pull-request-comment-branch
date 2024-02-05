import { context, getOctokit } from '@actions/github';

interface PullRequestDetailsResponse {
  repository: {
    pullRequest: {
      headRef: {
        name: string;
        target: {
          oid: string;
        };
      };
      baseRef: {
        name: string;
        target: {
          oid: string;
        };
      };
    };
  };
}

export async function isPullRequest(token: string) {
  const client = getOctokit(token);

  const {
    data: { pull_request: pullRequest },
  } = await client.rest.issues.get({
    ...context.repo,
    // eslint-disable-next-line camelcase
    issue_number: context.issue.number,
  });

  return !!pullRequest;
}

export async function pullRequestDetails(token: string) {
  const client = getOctokit(token);

  const {
    repository: {
      pullRequest: { baseRef, headRef },
    },
  } = await client.graphql<PullRequestDetailsResponse>(
    `
      query pullRequestDetails($repo:String!, $owner:String!, $number:Int!) {
        repository(name: $repo, owner: $owner) {
          pullRequest(number: $number) {
            baseRef {
              name
              target {
                oid
              }
            }
            headRef {
              name
              target {
                oid
              }
            }
          }
        }
      }
    `,
    {
      ...context.repo,
      number: context.issue.number,
    },
  );

  return {
    baseRef: baseRef.name,
    baseSha: baseRef.target.oid,
    headRef: headRef.name,
    headSha: headRef.target.oid,
  };
}
