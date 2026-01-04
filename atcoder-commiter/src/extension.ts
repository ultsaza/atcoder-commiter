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

  updateTreeViewState();

  const refreshCommand = vscode.commands.registerCommand(
    "atcoder-commiter.refresh",
    refreshSubmissions
  );

  const setUsernameCommand = vscode.commands.registerCommand(
    "atcoder-commiter.setUsername",
    setUsername
  );

  const setRepoCommand = vscode.commands.registerCommand(
    "atcoder-commiter.setRepo",
    setRepo
  );

  const setGitHubTokenCommand = vscode.commands.registerCommand(
    "atcoder-commiter.setGitHubToken",
    setGitHubToken
  );

  context.subscriptions.push(refreshCommand);
  context.subscriptions.push(setUsernameCommand);
  context.subscriptions.push(setRepoCommand);
  context.subscriptions.push(setGitHubTokenCommand);
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
    vscode.window.showWarningMessage("Please set your AtCoder username");

    await setUsername();
    return;
  }

  if (!repoUrl) {
    vscode.window.showWarningMessage("Please set your repository URL");

    await setRepo();
    return;
  }

  const token = stateManager.getGitHubToken();
  if (!token) {
    vscode.window.showWarningMessage("Please set your GitHub token");

    await setGitHubToken();
    return;
  }

  const outputDir = config.get<string>("outputDir", "");

  const fromSecond = stateManager.getLastTimestamp();

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Refreshing submissions...",
      cancellable: false,
    },
    async (progress) => {
      try {
        progress.report({ message: "connecting to GitHub..." });
        const saver = new SubmissionServer();
        await saver.initGitHubClient(token, repoUrl);

        progress.report({ message: "Fetching submissions..." });
        const submissions = await apiClient.getSubmissions(
          username,
          fromSecond
        );

        if (submissions.length === 0) {
          progress.report({ message: "No new submissions found" });
          return;
        }

        progress.report({ message: "Processing submissions..." });

        submissionTreeProvider.updateSubmissions(submissions);

        await saver.saveSubmissions(submissions, outputDir);

        const lastSubmission = submissions[submissions.length - 1];
        await stateManager.setLastTimestamp(lastSubmission.epoch_second);

        updateTreeViewState();

        vscode.window.showInformationMessage(
          "Submissions refreshed successfully"
        );
      } catch (error) {
        console.error("Failed to refresh submissions:", error);
        vscode.window.showErrorMessage("Failed to refresh submissions");
      }
    }
  );
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

async function setGitHubToken(): Promise<void> {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const currentToken = config.get<string>("githubToken", "");

  const token = await vscode.window.showInputBox({
    prompt: "Enter your GitHub Personal Access Token",
    value: currentToken,
    placeHolder: "Example: ghp_1234567890",
  });
  if (!token) {
    return;
  }

  await config.update(
    "githubToken",
    token.trim(),
    vscode.ConfigurationTarget.Global
  );
  updateTreeViewState();
  vscode.window.showInformationMessage(`GitHub token updated to ${token}`);
}
