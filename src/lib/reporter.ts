import figlet from 'figlet';
import chalk from 'chalk';
import { pastel } from 'gradient-string';
import type { ReportItem } from '@/lib/types';
import { loadConfig } from '@/lib/config.js';

function printHeader() {
    const title = figlet.textSync('WebLinter ', { font: 'Slant' });
    console.log(pastel.multiline(title));
    console.log(chalk.magentaBright.bold('🔍 Baseline-Aware Feature Checker\n'));
}

export async function report(results: ReportItem[]) {
    printHeader();
    const totalFilesWithReports = results.filter(x => x.lowBaseline.length > 0 || x.nonBaseline.length > 0).length;

    if (totalFilesWithReports === 0) {
        console.log(chalk.green('✅ No non-baseline features found.\n'));
        return;
    }

    console.log(chalk.yellow('⚠️  Found non-baseline features:\n'));

    const config = await loadConfig();
    const showNotFoundResults = config.showNotFoundResults ?? false;

    for (const result of results) {
        console.log(chalk.blueBright(`→ ${result.file}`));

        if (result.lowBaseline.length > 0) {
            console.log(chalk.yellow('  Warnings (low baseline):'));
            for (const feature of result.lowBaseline) {
                console.log(chalk.yellow(`    ⚠ ${feature}`));
            }
        }

        if (result.nonBaseline.length > 0) {
            console.log(chalk.red('  Errors (non-baseline):'));
            for (const feature of result.nonBaseline) {
                console.log(chalk.red(`    ✖ ${feature}`));
            }
        }

        if (showNotFoundResults && result.notFoundBaseline.length > 0) {
            console.log(chalk.red('  Errors (not found):'));
            for (const feature of result.notFoundBaseline) {
                console.log(chalk.red(`    ✖ ${feature}`));
            }
        }

        if (result !== results[results.length - 1]) {
            console.log(chalk.gray('─'.repeat(60)));
        }
    }

    console.log(`\n${chalk.red.bold(`✖ Total files with issues:`)} ${totalFilesWithReports}\n`);
}
