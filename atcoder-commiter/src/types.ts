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
  "AWK": ".awk",
  "Ada": ".adb",
  "Assembly": ".asm",
  "Bash": ".bash",
  "Brainfuck": ".bf",
  "C": ".c",
  "C#": ".cs",
  "C++": ".cpp",
  "COBOL": ".cbl",
  "Carp": ".carp",
  "Clojure": ".clj",
  "Common Lisp": ".lisp",
  "Crystal": ".cr",
  "Cyber": ".cy",
  "Cython": ".pyx",
  "D": ".d",
  "Dart": ".dart",
  "ECLiPSe": ".ecl",
  "Elixir": ".ex",
  "Emacs Lisp": ".el",
  "Erlang": ".erl",
  "F#": ".fs",
  "Factor": ".factor",
  "Forth": ".fs",
  "Fortran": ".f90",
  "Go": ".go",
  "Haskell": ".hs",
  "Haxe": ".hx",
  "Java": ".java",
  "JavaScript": ".js",
  "Julia": ".jl",
  "Koka": ".kk",
  "Kotlin": ".kt",
  "LLVM IR": ".ll",
  "Lua": ".lua",
  "Mercury": ".m",
  "Nibbles": ".nbl",
  "Nim": ".nim",
  "OCaml": ".ml",
  "Octave": ".m",
  "PHP": ".php",
  "Pascal": ".pas",
  "Perl": ".pl",
  "PowerShell": ".ps1",
  "Prolog": ".pl",
  "Python": ".py",
  "R": ".R",
  "Raku": ".p6",
  "ReasonML": ".re",
  "Ruby": ".rb",
  "Rust": ".rs",
  "SageMath": ".sage",
  "Scala": ".scala",
  "Scheme": ".scm",
  "Sed": ".sed",
  "Seed7": ".sd7",
  "Swift": ".swift",
  "Text": ".txt",
  "TypeScript": ".ts",
  "Unison": ".u",
  "V": ".v",
  "Vim": ".vim",
  "Visual Basic": ".vb",
  "Whitespace": ".ws",
  "Zig": ".zig",
  "Zsh": ".zsh",
  "bc": ".bc",
  "dc": ".dc",
  "jq": ".jq",
  "なでしこ": ".nako3",
  "プロデル": ".rdr",
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
