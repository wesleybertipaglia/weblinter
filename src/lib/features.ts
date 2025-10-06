import { readJson, resolvePath } from '@/lib/file.js';
import type { MatchResult } from '@/lib/types';

type FeatureType = 'html' | 'css' | 'javascript';

export async function matchFeatures(rawProperties: string[], type: FeatureType): Promise<MatchResult> {
    const filePath = resolvePath('src', 'data', `features-${type}.json`);
    const { low = [], non = [] } = await readJson<{ low: string[]; non: string[] }>(filePath);

    const lowSet = new Set(low);
    const nonSet = new Set(non);

    const lowBaseline: string[] = [];
    const notFoundBaseline: string[] = [];

    for (const prop of rawProperties) {
        if (nonSet.has(prop)) {
            notFoundBaseline.push(prop);
        } else if (lowSet.has(prop)) {
            lowBaseline.push(prop);
        }
    }

    return { lowBaseline, notFoundBaseline };
}
