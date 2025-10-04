#!/usr/bin/env node
import { Octokit } from "octokit";

if (process.argv.length < 3) {
    console.error("Give a github username. \nUsage: github-activity <github-username>");
    process.exit(1);
}

const cliUsername = process.argv[2];

function isValidUsername(username) {
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/;
    return usernameRegex.test(username);
}

async function isValidGitHubUsername(username) {
    const validUsername = isValidUsername(username);
    if (!validUsername) return false;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/events/public`);

        return response.status === 200;
    } catch (err) {
        console.error("Error fetching user:", err);
        return false;
    }
}

(async () => {
    const isValidGitHubUser = await isValidGitHubUsername(cliUsername);
    if (!isValidGitHubUser) {
        console.error("Invalid GitHub username. \nPlease provide a valid GitHub username.");
        process.exit(1);
    } else {
        console.log("Valid GitHub username.");
    }
})();

// This code is executed only if the username is valid
const octokit = new Octokit();

const response = await octokit.request('GET /users/{username}/events', {
  username: cliUsername,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

const events = response.data.slice(0, 5);
for (const event of events) {
    console.log(`${event.type} on ${event.repo.name} at ${event.created_at}`);
}