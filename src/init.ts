import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const configTemplate = `
{
    "include": [
        "src"
    ],
    "extensions": [
        "css",
        "html"
    ],
    "exclude": [
        "**/node_modules/**",
        "**/*.json"
    ],
    "cacheDays": 10
}
`;

export function init() {
    const filePath = resolve(process.cwd(), '.weblinter');

    if (existsSync(filePath)) {
        console.error('⚠️  .weblinter file already exists in this directory.');
        process.exit(1);
    }

    try {
        writeFileSync(filePath, configTemplate, { encoding: 'utf8' });
        console.log('✅ .weblinter config file created successfully!');
    } catch (err) {
        console.error('❌ Failed to create .weblinter file:', err);
        process.exit(1);
    }
}
