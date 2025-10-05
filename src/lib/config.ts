import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { WebLinterConfig } from '@/lib/types';

export async function loadConfig(): Promise<WebLinterConfig> {
    const configPath = resolve(process.cwd(), '.weblinterrc');
    const raw = await readFile(configPath, 'utf-8');
    const config = JSON.parse(raw) as WebLinterConfig;

    config.include = config.include ?? ['src'];
    config.extensions = config.extensions ?? ['html', 'css', 'js'];
    config.exclude = config.exclude ?? ['**/node_modules/**', '**/*.json'];
    config.cacheDays = config.cacheDays ?? 10;

    return config;
}
