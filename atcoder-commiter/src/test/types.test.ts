import * as assert from "assert";
import { getLanguageExtension, LANGUAGE_EXTENSIONS } from "../types";

suite("Types Test Suite", () => {
  suite("getLanguageExtension", () => {
    test("should return .cpp for C++ languages", () => {
      assert.strictEqual(getLanguageExtension("C++ (GCC 9.2.1)"), ".cpp");
      assert.strictEqual(getLanguageExtension("C++ 20 (gcc 12.2)"), ".cpp");
      assert.strictEqual(getLanguageExtension("C++17 (Clang 10.0.0)"), ".cpp");
    });

    test("should return .c for C languages", () => {
      assert.strictEqual(getLanguageExtension("C (GCC 12.2.0)"), ".c");
      assert.strictEqual(getLanguageExtension("C (Clang 16.0.6)"), ".c");
    });

    test("should return .cs for C# languages", () => {
      assert.strictEqual(getLanguageExtension("C# 11.0 (.NET 7.0.7)"), ".cs");
      assert.strictEqual(getLanguageExtension("C# (.NET Core 3.1.201)"), ".cs");
    });

    test("should correctly distinguish between C, C++, and C#", () => {
      // C++ should not match C
      assert.strictEqual(getLanguageExtension("C++ (GCC12)"), ".cpp");
      // C should not match C++ or C#
      assert.strictEqual(getLanguageExtension("C (GCC12)"), ".c");
      // C# should not match C or C++
      assert.strictEqual(getLanguageExtension("C# (Mono)"), ".cs");
    });

    test("should return .py for Python languages", () => {
      assert.strictEqual(getLanguageExtension("Python (3.8.2)"), ".py");
      assert.strictEqual(getLanguageExtension("Python (PyPy 7.3.0)"), ".py");
      assert.strictEqual(
        getLanguageExtension("Python 3.11.4 (CPython)"),
        ".py"
      );
    });

    test("should return .rs for Rust languages", () => {
      assert.strictEqual(getLanguageExtension("Rust (1.42.0)"), ".rs");
      assert.strictEqual(getLanguageExtension("Rust 1.70.0"), ".rs");
    });

    test("should return .txt for unknown languages", () => {
      assert.strictEqual(getLanguageExtension("UnknownLanguage"), ".txt");
      assert.strictEqual(getLanguageExtension(""), ".txt");
    });
  });

  suite("LANGUAGE_EXTENSIONS", () => {
    test("should have expected language mappings", () => {
      assert.strictEqual(LANGUAGE_EXTENSIONS["C++"], ".cpp");
      assert.strictEqual(LANGUAGE_EXTENSIONS["Python"], ".py");
      assert.strictEqual(LANGUAGE_EXTENSIONS["Rust"], ".rs");
    });

    test("should contain at least 3 languages", () => {
      const keys = Object.keys(LANGUAGE_EXTENSIONS);
      assert.ok(
        keys.length >= 3,
        `Expected at least 3 languages, got ${keys.length}`
      );
    });
  });
});
