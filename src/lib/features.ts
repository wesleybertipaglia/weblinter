import { readJson, resolvePath } from '@/lib/file.js';
import type { FeatureType, MatchResult } from '@/lib/types';

export async function matchFeatures(
    rawProperties: string[],
    types: FeatureType[]
): Promise<MatchResult> {
    const lowBaseline: string[] = [];
    const nonBaseline: string[] = [];
    const notFoundBaseline: string[] = [];

    const seen = new Set<string>();

    for (const type of types) {
        const filePath = resolvePath('.weblinter_data', `features-${type}.json`);
        const { low = [], non = [] } = await readJson<{ low: string[], non: string[] }>(filePath);

        const lowSet = new Set(low);
        const nonSet = new Set(non);

        for (const prop of rawProperties) {
            if (seen.has(prop)) continue;
            if (lowSet.has(prop)) {
                lowBaseline.push(prop);
                seen.add(prop);
            } else if (nonSet.has(prop)) {
                nonBaseline.push(prop);
                seen.add(prop);
            }
        }
    }

    for (const prop of rawProperties) {
        if (!seen.has(prop)) {
            notFoundBaseline.push(prop);
        }
    }

    return { lowBaseline, nonBaseline, notFoundBaseline };
}
