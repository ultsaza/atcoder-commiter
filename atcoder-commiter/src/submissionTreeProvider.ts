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
}
