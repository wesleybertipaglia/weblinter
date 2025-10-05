import figlet from 'figlet';
import chalk from 'chalk';
import { pastel } from 'gradient-string';
import type { ReportItem } from '@/lib/types';

function printHeader() {
    const title = figlet.textSync('WebLinter ', { font: 'Slant' });
    console.log(pastel.multiline(title));
    console.log(chalk.magentaBright.bold('🔍 Baseline-Aware Feature Checker\n'));
}

export function report(results: ReportItem[]) {
    printHeader();

    if (results.length === 0) {
        console.log(chalk.green('✅ No non-baseline features found.\n'));
        return;
    }

    console.log(chalk.yellow('⚠️  Found non-baseline features:\n'));

    for (const result of results) {
        console.log(chalk.blueBright(`→ ${result.file}`));

        if (result.warning.length > 0) {
            console.log(chalk.yellow('  Warnings (low baseline):'));
            for (const feature of result.warning) {
                console.log(chalk.yellow(`    ⚠ ${feature}`));
            }
        }

        if (result.error.length > 0) {
            console.log(chalk.red('  Errors (non-baseline):'));
            for (const feature of result.error) {
                console.log(chalk.red(`    ✖ ${feature}`));
            }
        }

        if (result !== results[results.length - 1]) {
            console.log(chalk.gray('─'.repeat(60)));
        }
    }

    console.log(`\n${chalk.red.bold(`✖ Total files with issues:`)} ${results.length}\n`);
}
