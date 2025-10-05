import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export function resolvePath(...paths: string[]): string {
    return path.resolve(process.cwd(), ...paths);
}

export async function ensureDirExists(dirPath: string) {
    await mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath: string, data: any) {
    const dir = path.dirname(filePath);
    await ensureDirExists(dir);
    const content = JSON.stringify(data, null, 2);
    await writeFile(filePath, content, 'utf8');
}

export async function readJson<T = any>(filePath: string): Promise<T> {
    const content = await readFile(filePath, 'utf8');
    return JSON.parse(content) as T;
}
