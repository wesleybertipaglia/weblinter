import { readJson, resolvePath } from '@/lib/file.js';
import type { MatchResult } from '@/lib/types';

type FeatureType = 'html' | 'css' | 'javascript';

export async function matchFeatures(rawProperties: string[], type: FeatureType): Promise<MatchResult> {
    const filePath = resolvePath('.weblinter_data', `features-${type}.json`);
    const { low = [], non = [] } = await readJson<{ low: string[], non: string[] }>(filePath);

    const lowSet = new Set(low);
    const nonSet = new Set(non);

    const lowBaseline: string[] = [];
    const nonBaseline: string[] = [];
    const notFoundBaseline: string[] = [];

    for (const prop of rawProperties) {
        if (lowSet.has(prop)) {
            lowBaseline.push(prop);
        } else if (nonSet.has(prop)) {
            nonBaseline.push(prop);
        } else {
            notFoundBaseline.push(prop);
        }
    }

    return { lowBaseline, nonBaseline, notFoundBaseline };
}
