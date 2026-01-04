import { Submission, getLanguageExtension } from "./types";
import { apiClient } from "./api";
import { GitHubClient } from "./githubClient.mjs";
import("./githubClient.mjs");

function formatDate(epochSecond: number): string {
    const date = new Date(epochSecond * 1000);
    return date.toISOString().replace(/:/g, "-").replace(/\.\d{3}Z$/, "");
}

export class SubmissionServer {
    private githubClient: GitHubClient | null = null;
    private defaultBranch: string | null = "main";
    
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
        outputDir: string,
        progressCallback?: (current: number, total: number, message?: string) => void
    ): Promise<void> {
        if (!this.githubClient) {
            throw new Error("GitHub client is not initialized");
        }
    }
}