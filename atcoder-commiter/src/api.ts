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
        const response = await axios.get<Submission[]>(
            url,
            {
                params: {
                    user: userId,
                    from_second: fromSecond,
                },
                timeout: 10000,
            }
        );
        return response.data;
    }
}