import * as vscode from "vscode";
import { apiClient } from "./api";
import { StateManager } from "./stateManager";
import { SubmissionServer } from "./submissionServer";
import { SubmissionTreeProvider } from "./submissionTreeProvider";

let stateManager: StateManager;
let submissionTreeProvider: SubmissionTreeProvider;

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "atcoder-commiter" is now active!'
  );

  stateManager = new StateManager(context);
  submissionTreeProvider = new SubmissionTreeProvider();

  stateManager.loadGitHubToken();

  const treeView = vscode.window.createTreeView(
    "atcoder-commiter.submissions",
    {
      treeDataProvider: submissionTreeProvider,
      showCollapseAll: false,
    }
  );
}

function updateTreeViewState(): void {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const username = config.get<string>("username", "");
  const repoUrl = config.get<string>("repoUrl", "");
  const lastTimestamp = stateManager.getLastTimestamp();
  const hasGitHubToken = stateManager.hasGitHubToken();
  submissionTreeProvider.updateState(
    username,
    lastTimestamp,
    repoUrl,
    hasGitHubToken
  );
}

async function refreshSubmissions(): Promise<void> {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const username = config.get<string>("username", "");
  const repoUrl = config.get<string>("repoUrl", "");

  if (!username) {
    vscode.window.showInformationMessage("Please set your AtCoder username");
    return;
  }

  if (!repoUrl) {
    vscode.window.showInformationMessage("Please set your repository URL");
    return;
  }

  if (!stateManager.hasGitHubToken()) {
    vscode.window.showInformationMessage("Please set your GitHub token");
    return;
  }

  const submissions = await apiClient.getSubmissions(
    username,
    stateManager.getLastTimestamp()
  );
  stateManager.setLastTimestamp(
    submissions[submissions.length - 1].epoch_second
  );
  submissionTreeProvider.updateSubmissions(submissions);
}

async function setUsername(): Promise<void> {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const currentUsername = config.get<string>("username", "");

  const username = await vscode.window.showInputBox({
    prompt: "Enter your AtCoder username",
    value: currentUsername,
  });
  if (!username) {
    return;
  }

  await config.update(
    "username",
    username.trim(),
    vscode.ConfigurationTarget.Global
  );
  updateTreeViewState();
  vscode.window.showInformationMessage(`Username updated to ${username}`);
}

async function setRepo(): Promise<void> {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const currentRepoUrl = config.get<string>("repoUrl", "");

  const repoUrl = await vscode.window.showInputBox({
    prompt: "Enter your archive repository URL",
    value: currentRepoUrl,
    placeHolder: "Example: https://github.com/username/archive.git",
  });
  if (!repoUrl) {
    return;
  }

  await config.update(
    "repoUrl",
    repoUrl.trim(),
    vscode.ConfigurationTarget.Global
  );
  updateTreeViewState();
  vscode.window.showInformationMessage(`Repository URL updated to ${repoUrl}`);
}
