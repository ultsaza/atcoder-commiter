import * as assert from "assert";

/**
 * Helper function to parse GitHub repository URL
 * This mirrors the logic in githubClient.mts for testing purposes
 */
function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  const httpsMatch = url.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
  if (httpsMatch) {
    return { owner: httpsMatch[1], repo: httpsMatch[2] };
  }

  const sshMatch = url.match(/git@github\.com:([^\/]+)\/([^\/\.]+)/);
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2] };
  }
  return null;
}

suite("GitHubClient Test Suite", () => {
  suite("parseRepoUrl", () => {
    test("should parse HTTPS URL correctly", () => {
      const result = parseRepoUrl("https://github.com/username/repo-name");
      assert.deepStrictEqual(result, { owner: "username", repo: "repo-name" });
    });

    test("should parse HTTPS URL with .git suffix", () => {
      const result = parseRepoUrl("https://github.com/username/repo-name.git");
      assert.deepStrictEqual(result, { owner: "username", repo: "repo-name" });
    });

    test("should parse SSH URL correctly", () => {
      const result = parseRepoUrl("git@github.com:username/repo-name");
      assert.deepStrictEqual(result, { owner: "username", repo: "repo-name" });
    });

    test("should parse SSH URL with .git suffix", () => {
      const result = parseRepoUrl("git@github.com:username/repo-name.git");
      assert.deepStrictEqual(result, { owner: "username", repo: "repo-name" });
    });

    test("should handle complex owner/repo names", () => {
      const result = parseRepoUrl("https://github.com/my-org/my-awesome-repo");
      assert.deepStrictEqual(result, {
        owner: "my-org",
        repo: "my-awesome-repo",
      });
    });

    test("should return null for invalid URLs", () => {
      assert.strictEqual(parseRepoUrl("not-a-url"), null);
      assert.strictEqual(parseRepoUrl("https://gitlab.com/user/repo"), null);
      assert.strictEqual(parseRepoUrl(""), null);
    });
  });
});
