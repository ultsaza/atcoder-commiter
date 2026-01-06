import { Submission, getLanguageExtension } from "./types";
import { apiClient } from "./api";
import { GitHubClient } from "./githubClient";

function formatDate(epochSecond: number): string {
  const date = new Date(epochSecond * 1000);
  return date
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\.\d{3}Z$/, "");
}

export interface CommitAuthor {
  name: string;
  email: string;
}

export class SubmissionServer {
  private githubClient: GitHubClient | null = null;
  private defaultBranch: string | null = "main";
  private author: CommitAuthor | null = null;

  setAuthor(author: CommitAuthor): void {
    this.author = author;
  }

  async initGitHubClient(token: string, repoUrl: string): Promise<void> {
    const parsed = GitHubClient.parseRepoUrl(repoUrl);
    if (!parsed) {
      throw new Error("Invalid repo URL");
    }

    this.githubClient = new GitHubClient(token, parsed.owner, parsed.repo);

    const exists = await this.githubClient.checkRepo();
    if (!exists) {
      throw new Error("Repository does not exist or access is denied");
    }

    this.defaultBranch = await this.githubClient.getDefaultBranch();
  }

  async saveSubmissions(
    submission: Submission[],
    outputDir: string
  ): Promise<void> {
    if (!this.githubClient) {
      throw new Error("GitHub client is not initialized");
    }
    for (const sub of submission) {
      if (sub.result !== "AC") {
        continue;
      }
      try {
        const code = await apiClient.getSubmissionCode(sub.contest_id, sub.id);
        const ext = getLanguageExtension(sub.language);
        const fileName = `${sub.problem_id}${ext}`;
        const basePath = `${sub.contest_id}/${sub.problem_id}/${fileName}`;
        const filePath = outputDir ? `${outputDir}/${basePath}` : basePath;

        const commitMessage = `[${sub.contest_id}] ${sub.problem_id}`;

        // Use createCommit which uses the low-level Git Data API
        // This properly supports custom commit timestamps
        await this.githubClient.createCommit(
          [{ path: filePath, content: code }],
          commitMessage,
          {
            branch: this.defaultBranch || undefined,
            authorName: this.author?.name || "AtCoder Commiter",
            authorEmail: this.author?.email || "AtCoder-Commiter@user.noreply.github.com",
            authorDate: new Date(sub.epoch_second * 1000).toISOString(),
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(error);
      }
    }
  }
}
