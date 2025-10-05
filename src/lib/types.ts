export interface WebLinterConfig {
    include?: string[];
    extensions?: string[];
    exclude?: string[];
    cacheDays?: number;
}

export interface MatchResult {
    lowBaseline: string[];
    notFoundBaseline: string[];
}

export interface ReportItem {
    file: string;
    warning: string[];
    error: string[];
}
