const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const name = core.getInput('name', { required: true });
    const shout = core.getBooleanInput('shout');

    let greeting = `Hello, ${name}!`;
    if (shout) greeting = greeting.toUpperCase();

    core.info(greeting);

    core.setOutput('greeting', greeting);
    core.setOutput('length', greeting.length.toString());

    const { eventName, repo } = github.context;
    core.info(`Triggered by event: ${eventName}`);
    core.info(`Running in repo: ${repo.owner}/${repo.repo}`);
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
