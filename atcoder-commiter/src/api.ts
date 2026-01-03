import axios from "axios";
import { Submission } from "./types";

const BASE_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3";
const ATCODER_BASE_URL = "https://atcoder.jp";

export class ApiClient {
  async getSubmissions(
    userId: string,
    fromSecond: number
  ): Promise<Submission[]> {
    const url = `${BASE_URL}/user/submissions`;
    const response = await axios.get<Submission[]>(url, {
      params: {
        user: userId,
        from_second: fromSecond,
      },
      timeout: 10000,
    });
    return response.data;
  }

  async getSubmissionCode(
    contestId: string,
    submissionId: number
  ): Promise<string> {
    const url = `${ATCODER_BASE_URL}/contests/${contestId}/submissions/${submissionId}`;
    const response = await axios.get<string>(url, {
      timeout: 10000,
    });

    const html = response.data as string;
    const codeMatch = html.match(
      /<pre[^>]*id="submission-code"[^>]*>(.*?)<\/pre>/s
    );
    if (!codeMatch) {
      throw new Error("Failed to extract code");
    }
    return codeMatch[1];
  }
}
