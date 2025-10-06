export interface WebLinterConfig {
    include?: string[];
    extensions?: string[];
    exclude?: string[];
    cacheDays?: number;
}

export interface MatchResult {
    lowBaseline: string[];
    nonBaseline: string[];
    notFoundBaseline: string[];
}

export interface ReportItem extends MatchResult {
    file: string;
}
