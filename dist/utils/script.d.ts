type SizeValue = (string | number)[][];
export declare function exec_vite_size({ branch }?: {
    branch?: string;
}): Promise<{
    status: number;
    size_values: undefined;
} | {
    status: number;
    size_values: SizeValue;
}>;
export declare function calcDiff({ current, base }: {
    current?: SizeValue;
    base?: SizeValue;
}): {
    diff_size_values: undefined;
} | {
    diff_size_values: (string | number)[][];
};
export {};
