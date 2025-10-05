import { globby } from 'globby';
import type { WebLinterConfig } from '@/lib/types.js';

export async function scanFiles(config: WebLinterConfig): Promise<string[]> {
    const patterns = config.include.map((dir: string) =>
        config.extensions.map((ext: string) => `${dir}/**/*.${ext}`)
    ).flat();

    const files = await globby(patterns, {
        ignore: config.exclude,
        absolute: true,
    });

    return files;
}
