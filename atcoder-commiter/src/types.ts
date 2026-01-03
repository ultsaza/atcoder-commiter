export interface Submission {
  id: number;
  epoch_second: number;
  problem_id: string;
  contest_id: string;
  user_id: string;
  language: string;
  point: number;
  length: number;
  result: string;
  execution_time?: number;
}

export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  // TODO: fill Record
  "C++": ".cpp",
  Python: ".py",
  Rust: ".rs",
};

export function getLanguageExtension(language: string): string {
  for (const [k, v] of Object.entries(LANGUAGE_EXTENSIONS)) {
    if (language.startsWith(k)) {
      return v;
    }
  }
  return ".txt";
}
