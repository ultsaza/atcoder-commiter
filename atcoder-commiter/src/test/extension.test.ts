import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Extension should be present", () => {
    const extension = vscode.extensions.getExtension(
      "ultsaza.atcoder-commiter"
    );
    assert.ok(extension, "Extension should be defined");
  });

  test("Extension should activate", async () => {
    const extension = vscode.extensions.getExtension(
      "ultsaza.atcoder-commiter"
    );
    if (extension) {
      await extension.activate();
      assert.ok(
        extension.isActive,
        "Extension should be active after activation"
      );
    }
  });

  suite("Commands", () => {
    test("refresh command should be registered", async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes("atcoder-commiter.refresh"),
        "refresh command should be registered"
      );
    });

    test("setUsername command should be registered", async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes("atcoder-commiter.setUsername"),
        "setUsername command should be registered"
      );
    });

    test("selectRepo command should be registered", async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes("atcoder-commiter.selectRepo"),
        "selectRepo command should be registered"
      );
    });

    test("login command should be registered", async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes("atcoder-commiter.login"),
        "login command should be registered"
      );
    });

    test("resetTimestamp command should be registered", async () => {
      const commands = await vscode.commands.getCommands(true);
      assert.ok(
        commands.includes("atcoder-commiter.resetTimestamp"),
        "resetTimestamp command should be registered"
      );
    });
  });

  suite("Configuration", () => {
    test("username configuration should exist", () => {
      const config = vscode.workspace.getConfiguration("atcoder-commiter");
      const username = config.get<string>("username");
      assert.ok(username !== undefined, "username config should be accessible");
    });

    test("outputDir configuration should exist", () => {
      const config = vscode.workspace.getConfiguration("atcoder-commiter");
      const outputDir = config.get<string>("outputDir");
      assert.ok(
        outputDir !== undefined,
        "outputDir config should be accessible"
      );
    });
  });
});
