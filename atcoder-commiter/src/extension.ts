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
	const username = config.get<string>("username");
	const lastTimestamp = config.get<number>("lastTimestamp");
	const repoUrl = stateManager.getRepoUrl();
	const hasGitHubToken = 
}