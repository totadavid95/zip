#!/usr/bin/env node
/**
 * @file CLI entry point.
 */

import chalk from 'chalk';
import { t } from 'i18next';
import { initializeI18n } from '../i18n';

import { ProgramContext } from './context';
import { handleStatement } from './handlers/statement';
import { handleZipping } from './handlers/zipping';
import { handleNotice } from './handlers/notice';

const main = async () => {
    try {
        await initializeI18n();
        const context = new ProgramContext();

        await handleStatement(context);
        await handleZipping(context);
        // FIXME: Verify the zip file.
        await handleNotice(context);
    } catch (error: unknown) {
        console.error(chalk.red(t('fatalError')));

        if (error instanceof Error) {
            console.error(chalk.red(error.message));
        } else {
            console.error(chalk.red(JSON.stringify(error)));
        }
    }
};

main();
