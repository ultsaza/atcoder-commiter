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
  "><>": ".fish",
  "Assembly": ".asm",
  "C": ".c",
  "C#": ".cs",
  "C++": ".cpp",
  "D": ".d",
  "Erlang": ".erl",
  "Fortran": ".f90",
  "Go": ".go",
  "Haskell": ".hs",
  "Java": ".java",
  "JavaScript": ".js",
  "Julia": ".jl",
  "Kotlin": ".kt",
  'Nim': '.nim',
  "OCaml": ".ml",
  "Pascal": ".pas",
  "Perl": ".pl",
  "PHP": ".php",
  "Python": ".py",
  "Ruby": ".rb",
  "Rust": ".rs",
  "Scala": ".scala",
  "Swift": ".swift",
  "TypeScript": ".ts",
};

export function getLanguageExtension(language: string): string {
  const sortedEntries = Object.entries(LANGUAGE_EXTENSIONS).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [k, v] of sortedEntries) {
    if (language.startsWith(k) && (language.length === k.length || language[k.length] === " ")) {
      return v;
    }
  }
  return ".txt";
}
