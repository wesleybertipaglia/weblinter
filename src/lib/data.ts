import { features as rawFeatures } from 'web-features';
import { normalizeFeature } from '@/lib/normalize.js';
import { writeJson, resolvePath } from '@/lib/file.js';

// prefixes
const PREFIXES = ['html.', 'css.', 'javascript.'];

// save data
export async function saveFeaturesByPrefixSummary() {
    for (const prefix of PREFIXES) {
        const result = { low: [] as string[], non: [] as string[] };

        for (const feature of Object.values(rawFeatures)) {
            if (!('status' in feature) || !('compat_features' in feature)) continue;

            const compatFeatures: string[] = feature.compat_features || [];
            const baseline = feature.status?.baseline;

            const matching = compatFeatures.filter(f => f.startsWith(prefix));

            if (matching.length === 0) continue;

            const normalized = matching.map(f => normalizeFeature(prefix, f));

            if (baseline === false) {
                result.non.push(...normalized);
            } else if (baseline === 'low') {
                result.low.push(...normalized);
            }
        }

        result.low = Array.from(new Set(result.low));
        result.non = Array.from(new Set(result.non));

        const filePath = resolvePath('src', 'data', `features-${prefix.replace('.', '')}.json`);
        await writeJson(filePath, result);
    }
}
