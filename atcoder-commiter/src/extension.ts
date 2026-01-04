import * as vscode from "vscode";
import { apiClient } from "./api";
import { StateManager } from "./stateManager";
import { SubmissionServer } from "./submissionServer";
import { SubmissionTreeProvider } from "./submissionTreeProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "atcoder-commiter" is now active!'
  );

  const stateManager = new StateManager(context);
  const submissionTreeProvider = new SubmissionTreeProvider();

  stateManager.loadGitHubToken();

  const treeView = vscode.window.createTreeView(
    "atcoder-commiter.submissions",
    {
      treeDataProvider: submissionTreeProvider,
      showCollapseAll: false,
    }
  );
}

export function deactivate() {}
