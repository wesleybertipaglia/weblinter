import { readFile, writeFile, access } from 'fs/promises';
import { resolvePath } from '@/lib/file.js';
import { loadConfig } from '@/lib/config.js';

const HISTORY_FILE = resolvePath('.weblinter', '.cache');

async function requiredDataFilesExist(): Promise<boolean> {
    const types = ['html', 'css', 'javascript'];
    try {
        await Promise.all(
            types.map(type =>
                access(resolvePath('.weblinter', `features-${type}.json`))
            )
        );
        return true;
    } catch {
        return false;
    }
}

export async function shouldUpdateFeatureCache(): Promise<boolean> {
    const config = await loadConfig();
    const maxDays = config.cacheDays ?? 10;

    try {
        const content = await readFile(HISTORY_FILE, 'utf-8');
        const { lastUpdated } = JSON.parse(content);
        const lastDate = new Date(lastUpdated);
        const now = new Date();
        const diffDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

        const dataFilesExist = await requiredDataFilesExist();
        return diffDays > maxDays || !dataFilesExist;
    } catch {
        return true;
    }
}

export async function updateFeatureCache(): Promise<void> {
    const data = { lastUpdated: new Date().toISOString() };
    await writeFile(HISTORY_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('✅ Updated cache.');
}
