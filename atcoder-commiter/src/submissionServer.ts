import { Submission, getLanguageExtension } from "./types";
import { apiClient } from "./api";
import("./githubClient.mjs");

function formatDate(epochSecond: number): string {
    const date = new Date(epochSecond * 1000);
    return date.toISOString().replace(/:/g, "-").replace(/\.\d{3}Z$/, "");
}
