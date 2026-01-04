import * as vscode from "vscode";

const STATE_KEY_LAST_TIMESTAMP = "atcoder-commiter.lastTimestamp";
const SECRET_KEY_GITHUB_TOKEN = "atcoder-commiter.githubToken";
const STATE_KEY_HAS_GITHUB_TOKEN = "atcoder-commiter.hasGitHubToken";
const STATE_KEY_CACHED_TOKEN = "atcoder-commiter.cachedToken";

export class StateManager {
  constructor(private context: vscode.ExtensionContext) {}

  getLastTimestamp(): number {
    return this.context.globalState.get<number>(STATE_KEY_LAST_TIMESTAMP, 0);
  }

  async setLastTimestamp(timestamp: number): Promise<void> {
    await this.context.globalState.update(STATE_KEY_LAST_TIMESTAMP, timestamp);
  }

  getGitHubToken(): string | undefined {
    return this.context.globalState.get<string>(SECRET_KEY_GITHUB_TOKEN);
  }

  hasGitHubToken(): boolean {
    return this.context.globalState.get<boolean>(
      STATE_KEY_HAS_GITHUB_TOKEN,
      false
    );
  }

  async setGitHubToken(token: string): Promise<void> {
    await this.context.secrets.store(SECRET_KEY_GITHUB_TOKEN, token);
    await this.context.globalState.update(STATE_KEY_HAS_GITHUB_TOKEN, true);
    await this.context.globalState.update(STATE_KEY_CACHED_TOKEN, token);
  }

  async deleteGitHubToken(): Promise<void> {
    await this.context.secrets.delete(SECRET_KEY_GITHUB_TOKEN);
    await this.context.globalState.update(STATE_KEY_HAS_GITHUB_TOKEN, false);
    await this.context.globalState.update(STATE_KEY_CACHED_TOKEN, undefined);
  }

  async loadGitHubToken(): Promise<void> {
    const token = await this.context.secrets.get(SECRET_KEY_GITHUB_TOKEN);
    if (token) {
      await this.context.globalState.update(STATE_KEY_CACHED_TOKEN, token);
      await this.context.globalState.update(STATE_KEY_HAS_GITHUB_TOKEN, true);
    }
  }
}
