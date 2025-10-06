export interface WebLinterConfig {
    include?: string[];
    extensions?: string[];
    exclude?: string[];
    cacheDays?: number;
    showNotFoundResults?: boolean;
}

export interface MatchResult {
    lowBaseline: string[];
    nonBaseline: string[];
    notFoundBaseline: string[];
}

export interface ReportItem extends MatchResult {
    file: string;
}

export type FeatureType = 'html' | 'css' | 'javascript';
