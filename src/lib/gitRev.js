import { execSync } from 'child_process';

export function getGitCommitHash() {
  try {
    // Run the Git command to get the latest commit hash
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    return commitHash;
  } catch (error) {
    console.error('Failed to get Git commit hash', error);
    return null;
  }
}
