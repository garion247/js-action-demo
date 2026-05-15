const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const name = core.getInput('name', { required: true });
    const shout = core.getBooleanInput('shout');
    const postComment = core.getBooleanInput('post-comment');
    const token = core.getInput('github-token');

    let greeting = `Hello, ${name}!`;
    if (shout) greeting = greeting.toUpperCase();

    core.info(greeting);
    core.setOutput('greeting', greeting);
    core.setOutput('length', greeting.length.toString());

    if (postComment) {
      if (github.context.eventName !== 'pull_request') {
        core.warning('post-comment is true but event is not pull_request - skipping');
        return;
      }
      if (!token) {
        core.setFailed('github-token is required when post-comment is true');
        return;
      }

      const octokit = github.getOctokit(token);
      const { owner, repo } = github.context.repo;
      const issue_number = github.context.payload.pull_request.number;

      await octokit.rest.issues.createComment({
        owner, repo, issue_number,
        body: `:wave: ${greeting} (from greeter action run #${github.context.runNumber})`,
      });
      core.info(`Commented on PR #${issue_number}`);
    }
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
