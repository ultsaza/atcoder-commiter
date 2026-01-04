import { Octokit } from "@octokit/rest";

export interface Repository {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
}

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

  /**
   * Fetch repositories accessible by the authenticated user
   */
  static async fetchUserRepositories(token: string): Promise<Repository[]> {
    const octokit = new Octokit({
      auth: token,
      userAgent: "atcoder-commiter-vscode-extension/1.0.0",
    });

    const repos: Repository[] = [];
    let page = 1;
    const perPage = 100;

    // Fetch up to 300 repositories (3 pages)
    while (page <= 3) {
      const response = await octokit.repos.listForAuthenticatedUser({
        visibility: "all",
        affiliation: "owner,collaborator,organization_member",
        sort: "updated",
        per_page: perPage,
        page,
      });

      repos.push(
        ...response.data.map((repo) => ({
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          description: repo.description,
          private: repo.private,
        }))
      );

      if (response.data.length < perPage) {
        break;
      }
      page++;
    }

    return repos;
  }

  /**
   * Get authenticated user info
   */
  static async getAuthenticatedUser(
    token: string
  ): Promise<{ login: string; name: string | null }> {
    const octokit = new Octokit({
      auth: token,
      userAgent: "atcoder-commiter-vscode-extension/1.0.0",
    });

    const response = await octokit.users.getAuthenticated();
    return {
      login: response.data.login,
      name: response.data.name,
    };
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

  async getFileSHA(path: string, branch?: string): Promise<string | null> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: branch,
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
  ): Promise<{ sha: string; url: string }> {
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
      const authorInfo: { name: string; email: string; date?: string } = {
        name: options.authorName,
        email: options.authorEmail,
      };
      if (options?.authorDate) {
        authorInfo.date = options.authorDate;
      }
      params.author = authorInfo;
      params.committer = authorInfo;
    }

    const response = await this.octokit.repos.createOrUpdateFileContents(
      params
    );
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
  ): Promise<{ sha: string }> {
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

    const treeItems: Array<{
      path: string;
      mode: "100644";
      type: "blob";
      sha: string;
    }> = [];

    for (const file of files) {
      const blobResponse = await this.octokit.rest.git.createBlob({
        owner: this.owner,
        repo: this.repo,
        content: Buffer.from(file.content, "utf-8").toString("base64"),
        encoding: "base64",
      });

      treeItems.push({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobResponse.data.sha,
      });
    }

    const treeResponse = await this.octokit.rest.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: baseTreeSHA,
      tree: treeItems,
    });

    const commitParams: any = {
      owner: this.owner,
      repo: this.repo,
      message,
      tree: treeResponse.data.sha,
      parents: [latestCommitSHA],
    };

    if (options?.authorName && options?.authorEmail) {
      commitParams.author = {
        name: options.authorName,
        email: options.authorEmail,
      };
      if (options.authorDate) {
        commitParams.author.date = options.authorDate;
      }
      commitParams.committer = commitParams.author;
    }

    const newCommitResponse = await this.octokit.rest.git.createCommit(
      commitParams
    );

    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branch}`,
      sha: newCommitResponse.data.sha,
    });
    return { sha: newCommitResponse.data.sha };
  }

  async checkRepo(): Promise<boolean> {
    try {
      await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo,
      });
      return true;
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async getDefaultBranch(): Promise<string> {
    const response = await this.octokit.rest.repos.get({
      owner: this.owner,
      repo: this.repo,
    });
    return response.data.default_branch;
  }
}
