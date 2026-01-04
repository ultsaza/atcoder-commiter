import * as vscode from 'vscode';
import { Submission } from './types';

export class SubmissionItem extends vscode.TreeItem {
    constructor(
        public readonly submission: Submission,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
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
        Submitted at: ${dateStr}`;
    }
}