import * as vscode from "vscode";
import { Submission } from "./types";

export class SubmissionItem extends vscode.TreeItem {
  constructor(
    public readonly submission: Submission,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    const date = new Date(submission.epoch_second * 1000);
    const dateStr = date.toLocaleString();
    const label = `[${submission.problem_id}] - ${submission.result}`;

    super(label, collapsibleState);

    this.description = dateStr;
    this.tooltip = `Contest: ${submission.contest_id}
        Problem: ${submission.problem_id}
        Result: ${submission.result}
        Language: ${submission.language}
        Point: ${submission.point}
        Execution time: ${submission.execution_time} [ms]
        Submitted at: ${dateStr}`;

    this.iconPath = new vscode.ThemeIcon(
      "check",
      new vscode.ThemeColor("testing.iconPassed")
    );
  }
}

export class SubmissionTreeProvider
  implements vscode.TreeDataProvider<SubmissionItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    SubmissionItem | undefined | void
  > = new vscode.EventEmitter<SubmissionItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SubmissionItem | undefined | void
  > = this._onDidChangeTreeData.event;

  private submissions: Submission[] = [];
  private lastTimestamp: number = 0;
  private username: string = "";
  private repoUrl: string = "";
  private hasGitHubToken: boolean = false;

  updateSubmissions(submissions: Submission[]) {
    this.submissions = submissions;
    this._onDidChangeTreeData.fire();
  }

  updateState(
    username: string,
    lastTimestamp: number,
    repoUrl: string,
    hasGitHubToken: boolean
  ) {
    this.username = username;
    this.lastTimestamp = lastTimestamp;
    this.repoUrl = repoUrl;
    this.hasGitHubToken = hasGitHubToken;
    this._onDidChangeTreeData.fire();
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SubmissionItem): vscode.TreeItem {
    return element;
  }

  getChildren(
    element?: SubmissionItem | undefined
  ): Thenable<SubmissionItem[]> {
    if (element) {
      return Promise.resolve([]);
    }
    return Promise.resolve(
      this.submissions.map(
        (submission) =>
          new SubmissionItem(submission, vscode.TreeItemCollapsibleState.None)
      )
    );
  }

  getWelcomeMessage(): string {
    const messages: string[] = [];
    if (!this.hasGitHubToken) {
      messages.push("Please set your GitHub token.");
    }
    if (!this.repoUrl) {
      messages.push("Please set your repository URL.");
    }
    if (!this.username) {
      messages.push("Please set your AtCoder username.");
    }
    if (this.username && this.repoUrl && this.hasGitHubToken) {
      messages.push("Ready to commit!");
    }
    return messages.join("\n");
  }
}
