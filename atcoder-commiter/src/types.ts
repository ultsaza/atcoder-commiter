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
     "Python (CPython 3.13.7)": ".py", 
};
