import * as vscode from "vscode";
import { apiClient } from "./api";
import { StateManager } from "./stateManager";
import { SubmissionServer } from "./submissionServer";
import { SubmissionTreeProvider } from "./submissionTreeProvider";
import { GitHubClient } from "./githubClient";

let stateManager: StateManager;
let submissionTreeProvider: SubmissionTreeProvider;

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "atcoder-commiter" is now active!'
  );

  stateManager = new StateManager(context);
  submissionTreeProvider = new SubmissionTreeProvider();

  const treeView = vscode.window.createTreeView(
    "atcoder-commiter.submissions",
    {
      treeDataProvider: submissionTreeProvider,
      showCollapseAll: false,
    }
  );

  // Initial state update
  updateTreeViewState();

  // Register commands
  const refreshCommand = vscode.commands.registerCommand(
    "atcoder-commiter.refresh",
    refreshSubmissions
  );

  const setUsernameCommand = vscode.commands.registerCommand(
    "atcoder-commiter.setUsername",
    setUsername
  );

  const selectRepoCommand = vscode.commands.registerCommand(
    "atcoder-commiter.selectRepo",
    selectRepository
  );

  const loginCommand = vscode.commands.registerCommand(
    "atcoder-commiter.login",
    loginToGitHub
  );

  const resetTimestampCommand = vscode.commands.registerCommand(
    "atcoder-commiter.resetTimestamp",
    resetTimestamp
  );

  context.subscriptions.push(refreshCommand);
  context.subscriptions.push(setUsernameCommand);
  context.subscriptions.push(selectRepoCommand);
  context.subscriptions.push(loginCommand);
  context.subscriptions.push(resetTimestampCommand);
  context.subscriptions.push(treeView);
}

async function updateTreeViewState(): Promise<void> {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const username = config.get<string>("username", "");
  const repoUrl = stateManager.getSelectedRepo() || "";
  const lastTimestamp = stateManager.getLastTimestamp();
  const hasGitHubSession = await stateManager.hasGitHubSession();
  submissionTreeProvider.updateState(
    username,
    lastTimestamp,
    repoUrl,
    hasGitHubSession
  );
}

async function loginToGitHub(): Promise<void> {
  try {
    const session = await stateManager.loginToGitHub();
    if (session) {
      const userInfo = await GitHubClient.getAuthenticatedUser(
        session.accessToken
      );
      vscode.window.showInformationMessage(
        `Logged in to GitHub as ${userInfo.login}`
      );
      await updateTreeViewState();
    }
  } catch (error) {
    console.error("Failed to login to GitHub:", error);
    vscode.window.showErrorMessage("Failed to login to GitHub");
  }
}

async function selectRepository(): Promise<void> {
  // First, ensure user is logged in
  const token = await stateManager.getGitHubToken();
  if (!token) {
    const login = await vscode.window.showInformationMessage(
      "Please login to GitHub first",
      "Login"
    );
    if (login === "Login") {
      await loginToGitHub();
      return selectRepository();
    }
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Fetching repositories...",
      cancellable: false,
    },
    async () => {
      try {
        const repos = await GitHubClient.fetchUserRepositories(token);

        if (repos.length === 0) {
          vscode.window.showWarningMessage("No repositories found");
          return;
        }

        const items = repos.map((repo) => ({
          label: repo.full_name,
          description: repo.private ? "🔒 Private" : "🌐 Public",
          detail: repo.description || "",
          repo,
        }));

        const selected = await vscode.window.showQuickPick(items, {
          placeHolder: "Select a repository for saving submissions",
          matchOnDescription: true,
          matchOnDetail: true,
        });

        if (selected) {
          await stateManager.setSelectedRepo(selected.repo.html_url);
          await updateTreeViewState();
          vscode.window.showInformationMessage(
            `Repository set to ${selected.repo.full_name}`
          );
        }
      } catch (error) {
        console.error("Failed to fetch repositories:", error);
        vscode.window.showErrorMessage("Failed to fetch repositories");
      }
    }
  );
}

async function refreshSubmissions(): Promise<void> {
  const config = vscode.workspace.getConfiguration("atcoder-commiter");
  const username = config.get<string>("username", "");
  const repoUrl = stateManager.getSelectedRepo();

  if (!username) {
    vscode.window.showWarningMessage("Please set your AtCoder username");
    await setUsername();
    return;
  }

  if (!repoUrl) {
    vscode.window.showWarningMessage("Please select a repository");
    await selectRepository();
    return;
  }

  const token = await stateManager.getGitHubToken();
  if (!token) {
    vscode.window.showWarningMessage("Please login to GitHub");
    await loginToGitHub();
    return;
  }

  const outputDir = config.get<string>("outputDir", "");
  const fromSecond = stateManager.getLastTimestamp();

  // Disable refresh button while running
  await vscode.commands.executeCommand(
    "setContext",
    "atcoder-commiter.isRefreshing",
    true
  );

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "",
        cancellable: false,
      },
      async (progress) => {
        progress.report({ message: "Connecting to GitHub..." });
        const saver = new SubmissionServer();
        await saver.initGitHubClient(token, repoUrl);

        // Get authenticated user info for commit author
        const userInfo = await GitHubClient.getAuthenticatedUser(token);
        saver.setAuthor({
          name: userInfo.name || userInfo.login,
          email: userInfo.email,
        });

        progress.report({ message: "Fetching submissions..." });
        const allSubmissions = await apiClient.getSubmissions(
          username,
          fromSecond
        );

        // Filter to only AC (Accepted) submissions
        const submissions = allSubmissions.filter((sub) => sub.result === "AC");

        if (submissions.length === 0) {
          vscode.window.showInformationMessage(
            allSubmissions.length > 0
              ? `Found ${allSubmissions.length} submissions, but none were AC`
              : "No new submissions found"
          );
          return;
        }

        progress.report({
          message: `Processing ${submissions.length} AC submissions...`,
        });

        submissionTreeProvider.updateSubmissions(submissions);

        await saver.saveSubmissions(submissions, outputDir, (current, total, sub) => {
          progress.report({
            message: `Processing submissions (${current}/${total}): ${sub.problem_id}`,
          });
        });

        const lastSubmission = allSubmissions[allSubmissions.length - 1];
        await stateManager.setLastTimestamp(lastSubmission.epoch_second + 1);

        await updateTreeViewState();

        vscode.window.showInformationMessage(
          `${submissions.length} AC submission(s) committed successfully`
        );
      }
    );
  } catch (error) {
    console.error("Failed to refresh submissions:", error);
    vscode.window.showErrorMessage("Failed to refresh submissions");
  } finally {
    // Re-enable refresh button
    await vscode.commands.executeCommand(
      "setContext",
      "atcoder-commiter.isRefreshing",
      false
    );
  }
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
  await updateTreeViewState();
  vscode.window.showInformationMessage(`Username updated to ${username}`);
}

async function resetTimestamp(): Promise<void> {
  await stateManager.resetTimestamp();
  await updateTreeViewState();
  vscode.window.showInformationMessage("Timestamp has been reset.");
}

export function deactivate() {}
