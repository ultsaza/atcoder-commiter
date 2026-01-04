import * as vscode from "vscode";

const STATE_KEY_LAST_TIMESTAMP = "atcoder-commiter.lastTimestamp";
const STATE_KEY_SELECTED_REPO = "atcoder-commiter.selectedRepo";

// GitHub OAuth scopes needed for repository access
const GITHUB_SCOPES = ["repo"];

export class StateManager {
  constructor(private context: vscode.ExtensionContext) {}

  getLastTimestamp(): number {
    return this.context.globalState.get<number>(STATE_KEY_LAST_TIMESTAMP, 0);
  }

  async setLastTimestamp(timestamp: number): Promise<void> {
    await this.context.globalState.update(STATE_KEY_LAST_TIMESTAMP, timestamp);
  }

  async resetTimestamp(): Promise<void> {
    await this.context.globalState.update(STATE_KEY_LAST_TIMESTAMP, 0);
  }

  // GitHub OAuth Authentication
  async getGitHubSession(
    createIfNone: boolean = false
  ): Promise<vscode.AuthenticationSession | undefined> {
    try {
      const session = await vscode.authentication.getSession(
        "github",
        GITHUB_SCOPES,
        { createIfNone }
      );
      return session;
    } catch (error) {
      console.error("Failed to get GitHub session:", error);
      return undefined;
    }
  }

  async getGitHubToken(): Promise<string | undefined> {
    const session = await this.getGitHubSession(false);
    return session?.accessToken;
  }

  async hasGitHubSession(): Promise<boolean> {
    const session = await this.getGitHubSession(false);
    return session !== undefined;
  }

  async loginToGitHub(): Promise<vscode.AuthenticationSession | undefined> {
    return this.getGitHubSession(true);
  }

  async logoutFromGitHub(): Promise<void> {
    // Note: VS Code doesn't provide a direct logout API for authentication providers
    // The user needs to manage sessions through VS Code's account menu
    vscode.window.showInformationMessage(
      "To logout from GitHub, use the account menu in the bottom-left of VS Code."
    );
  }

  // Repository selection
  getSelectedRepo(): string | undefined {
    return this.context.globalState.get<string>(STATE_KEY_SELECTED_REPO);
  }

  async setSelectedRepo(repoUrl: string): Promise<void> {
    await this.context.globalState.update(STATE_KEY_SELECTED_REPO, repoUrl);
  }

  async clearSelectedRepo(): Promise<void> {
    await this.context.globalState.update(STATE_KEY_SELECTED_REPO, undefined);
  }
}
