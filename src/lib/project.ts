import fs from 'fs/promises';
import path from 'path';

export async function assertInProjectRoot(): Promise<void> {
    const rootFile = path.resolve(process.cwd(), 'package.json');

    try {
        await fs.access(rootFile);
    } catch {
        throw new Error(
            '❌ weblinter must be run from the root of your project (where package.json is located).'
        );
    }
}
