#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { globby } from 'globby';
import { loadConfig } from '@/lib/config.js';
import { analyzeCssFile } from '@/analyzer/cssAnalyzer.js';
import { analyzeHtmlFile } from '@/analyzer/htmlAnalyzer.js';
import { matchFeatures } from '@/lib/features.js';
import { report } from '@/lib/reporter.js';
import { scanFiles } from '@/lib/scanner.js';
import { shouldUpdateFeatureCache, updateFeatureCache } from '@/lib/cache.js';
import { saveFeaturesByPrefixSummary } from '@/lib/data.js';
import type { MatchResult } from '@/lib/types.js';
import { assertInProjectRoot } from '@/lib/project';

const program = new Command();

program
    .name('weblinter')
    .description('CLI tool to detect non-baseline web features')
    .version('0.1.0')
    .argument('[inputPath]', 'file or directory to analyze')
    .action(async (inputPath) => {
        try {
            await assertInProjectRoot();

            const shouldUpdate = await shouldUpdateFeatureCache();

            if (shouldUpdate) {
                console.log('🕵️ Generating web features data...');
                await saveFeaturesByPrefixSummary();
                await updateFeatureCache();
            }

            let files: string[] = [];
            const config = await loadConfig();

            if (inputPath) {
                const stat = await fs.promises.stat(inputPath);
                if (stat.isDirectory()) {
                    const patterns = config.extensions!.map(ext => `${inputPath}/**/*.${ext}`);
                    files = await globby(patterns, {
                        ignore: config.exclude,
                        absolute: true,
                    });
                } else {
                    files = [inputPath];
                }
            } else {
                files = await scanFiles(config);
            }

            const results: { file: string; warning: string[]; error: string[] }[] = [];

            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                let props: string[] = [];
                let type: 'html' | 'css' | 'js' | null = null;

                if (['.css', '.scss', '.less', '.sass'].includes(ext)) {
                    props = await analyzeCssFile(file);
                    type = 'css';
                } else if (ext === '.html') {
                    props = await analyzeHtmlFile(file);
                    type = 'html';
                } else {
                    console.warn(`⚠️ Skipping unsupported file type: ${file}`);
                    continue;
                }

                if (type) {
                    const nonBaseline: MatchResult = await matchFeatures(props, type);

                    if (nonBaseline.lowBaseline.length > 0 || nonBaseline.notFoundBaseline.length > 0) {
                        results.push({
                            file,
                            warning: nonBaseline.lowBaseline,
                            error: nonBaseline.notFoundBaseline,
                        });
                    }
                }
            }

            report(results);
        } catch (err) {
            console.error(err instanceof Error ? err.message : err);
            process.exit(1);
        }
    });

program.parse();
