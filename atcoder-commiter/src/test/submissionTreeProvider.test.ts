import * as assert from "assert";
import * as vscode from "vscode";
import {
  SubmissionTreeProvider,
  SubmissionItem,
} from "../submissionTreeProvider";
import { Submission } from "../types";

suite("SubmissionTreeProvider Test Suite", () => {
  const mockSubmission: Submission = {
    id: 12345678,
    epoch_second: 1704067200, // 2024-01-01 00:00:00 UTC
    problem_id: "abc300_a",
    contest_id: "abc300",
    user_id: "testuser",
    language: "C++ (GCC 9.2.1)",
    point: 100,
    length: 500,
    result: "AC",
    execution_time: 10,
  };

  const mockSubmissionWA: Submission = {
    ...mockSubmission,
    id: 12345679,
    result: "WA",
    point: 0,
  };

  suite("SubmissionItem", () => {
    test("should create item with correct label", () => {
      const item = new SubmissionItem(
        mockSubmission,
        vscode.TreeItemCollapsibleState.None
      );
      assert.strictEqual(item.label, "[abc300_a] - AC");
    });

    test("should have description with date", () => {
      const item = new SubmissionItem(
        mockSubmission,
        vscode.TreeItemCollapsibleState.None
      );
      assert.ok(item.description, "Description should be defined");
      assert.ok(
        typeof item.description === "string",
        "Description should be a string"
      );
    });

    test("should have tooltip with submission details", () => {
      const item = new SubmissionItem(
        mockSubmission,
        vscode.TreeItemCollapsibleState.None
      );
      assert.ok(item.tooltip, "Tooltip should be defined");
      const tooltip = item.tooltip as string;
      assert.ok(
        tooltip.includes("abc300"),
        "Tooltip should include contest_id"
      );
      assert.ok(
        tooltip.includes("abc300_a"),
        "Tooltip should include problem_id"
      );
      assert.ok(tooltip.includes("AC"), "Tooltip should include result");
    });

    test("should have check icon for AC submissions", () => {
      const item = new SubmissionItem(
        mockSubmission,
        vscode.TreeItemCollapsibleState.None
      );
      assert.ok(item.iconPath instanceof vscode.ThemeIcon);
      assert.strictEqual((item.iconPath as vscode.ThemeIcon).id, "check");
    });
  });

  suite("SubmissionTreeProvider", () => {
    let provider: SubmissionTreeProvider;

    setup(() => {
      provider = new SubmissionTreeProvider();
    });

    test("should return empty array when no submissions", async () => {
      const children = await provider.getChildren();
      assert.strictEqual(children.length, 0);
    });

    test("should return submission items after updateSubmissions", async () => {
      provider.updateSubmissions([mockSubmission, mockSubmissionWA]);
      const children = await provider.getChildren();
      assert.strictEqual(children.length, 2);
    });

    test("should return empty array for child elements", async () => {
      provider.updateSubmissions([mockSubmission]);
      const items = await provider.getChildren();
      const children = await provider.getChildren(items[0]);
      assert.strictEqual(children.length, 0);
    });

    test("getTreeItem should return the same element", () => {
      const item = new SubmissionItem(
        mockSubmission,
        vscode.TreeItemCollapsibleState.None
      );
      assert.strictEqual(provider.getTreeItem(item), item);
    });

    test("should fire event when submissions updated", (done) => {
      provider.onDidChangeTreeData(() => {
        done();
      });
      provider.updateSubmissions([mockSubmission]);
    });

    test("should fire event when state updated", (done) => {
      provider.onDidChangeTreeData(() => {
        done();
      });
      provider.updateState(
        "testuser",
        1704067200,
        "https://github.com/user/repo",
        true
      );
    });

    test("should fire event on refresh", (done) => {
      provider.onDidChangeTreeData(() => {
        done();
      });
      provider.refresh();
    });
  });

  suite("getWelcomeMessage", () => {
    let provider: SubmissionTreeProvider;

    setup(() => {
      provider = new SubmissionTreeProvider();
    });

    test("should show all setup messages when nothing configured", () => {
      provider.updateState("", 0, "", false);
      const message = provider.getWelcomeMessage();
      assert.ok(
        message.includes("GitHub token"),
        "Should mention GitHub token"
      );
      assert.ok(
        message.includes("repository URL"),
        "Should mention repository URL"
      );
      assert.ok(
        message.includes("AtCoder username"),
        "Should mention username"
      );
    });

    test("should show ready message when fully configured", () => {
      provider.updateState(
        "testuser",
        1704067200,
        "https://github.com/user/repo",
        true
      );
      const message = provider.getWelcomeMessage();
      assert.ok(
        message.includes("Ready to commit"),
        "Should show ready message"
      );
    });

    test("should not show ready message when partially configured", () => {
      provider.updateState("testuser", 0, "", false);
      const message = provider.getWelcomeMessage();
      assert.ok(
        !message.includes("Ready to commit"),
        "Should not show ready message"
      );
    });
  });
});
