import { Octokit } from "@octokit/rest";
import { StringLiteral } from "typescript";

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({
      auth: token,
      userAgent: "atcoder-commiter-vscode-extension/1.0.0",
    });
    this.owner = owner;
    this.repo = repo;
  }

  static parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const httpsMatch = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
    if (httpsMatch) {
      return { owner: httpsMatch[1], repo: httpsMatch[2] };
    }

    const sshMatch = url.match(/git@github\.com:([^\/]+)\/([^\/\.]+)/);
    if (sshMatch) {
      return { owner: sshMatch[1], repo: sshMatch[2] };
    }
    return null;
  }

  async getFileSHA(path: string, branch?:string): Promise<string | null> {
    try {
        const response = await this.octokit.repos.getContent({
            owner: this.owner,
            repo: this.repo,
            path: path,
            ref: branch
        });

        if (!Array.isArray(response.data) && response.data.type === "file") {
            return response.data.sha;
        }
        return null;
    } catch (error: any) {
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
  }

  async createOrUpdateFile(
    path: string,
    content: string,
    message: string,
    options?: { 
        branch?: string; 
        authorName?: string;
        authorEmail?: string;
        authorDate?: string;
    }
  ): Promise<{ sha: string, url: string }> {
    const encodedContent = Buffer.from(content, "utf-8").toString("base64");
    const existingSHA = await this.getFileSHA(path, options?.branch);

    const params: any = {
        owner: this.owner,
        repo: this.repo,
        path: path,
        message,
        content: encodedContent,
    };

    if (existingSHA) {
        params.sha = existingSHA;
    }

    if (options?.branch) {
        params.branch = options.branch;
    }

    if (options?.authorName && options?.authorEmail) {
        params.committer = {
            name: options.authorName,
            email: options.authorEmail,
        };
        if (options?.authorDate) {
            params.committer.date = options.authorDate;
        }
    }

    const response = await this.octokit.repos.createOrUpdateFileContents(params);
    return {
        sha: response.data.commit.sha || "",
        url: response.data.content!.html_url || "",
    };
  }

  async createCommit(
    files: Array<{ path: string; content: string }>,
    message: string,
    options?: {
        branch?: string;
        authorName?: string;
        authorEmail?: string;
        authorDate?: string;
    }
  ): Promise<{ sha: string}> {
    const branch = options?.branch || "main";

    let latestCommitSHA: string;
    let baseTreeSHA: string;

    try {
        const refResponse = await this.octokit.rest.git.getRef({
            owner: this.owner,
            repo: this.repo,
            ref: `heads/${branch}`,
        });
        latestCommitSHA = refResponse.data.object.sha;
        
        const commitResponse = await this.octokit.rest.git.getCommit({
            owner: this.owner,
            repo: this.repo,
            commit_sha: latestCommitSHA,
        });
        baseTreeSHA = commitResponse.data.tree.sha;
    } catch (error: any) {
        if (error.status === 404) {
            throw new Error(`Branch ${branch} does not exist.`);
        }
        throw error;
    }
  }
}