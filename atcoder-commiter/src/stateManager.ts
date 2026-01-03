import * as vscode from 'vscode';

const STATE_KEY_LAST_TIMESTAMP = "atcoder-commiter.lastTimestamp";

export class StateManager {
    constructor(private context: vscode.ExtensionContext) {}

    getLastTimestamp(): number {
        return this.context.globalState.get<number>(STATE_KEY_LAST_TIMESTAMP, 0);
    }

    async setLastTimestamp(timestamp: number): Promise<void> {
        await this.context.globalState.update(STATE_KEY_LAST_TIMESTAMP, timestamp);
    }
}
