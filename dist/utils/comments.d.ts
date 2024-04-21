import type { getOctokit } from '@actions/github';
export declare const VITE_SIZE_HEADING = "# \u267B\uFE0F Vite-Size \u267B\uFE0F";
export declare function fetchPreviousComment(octokit: ReturnType<typeof getOctokit>, repo: {
    owner: string;
    repo: string;
}, pr: {
    number: number;
    [key: string]: any;
}): Promise<unknown>;
