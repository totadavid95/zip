#!/usr/bin/env node
/**
 * @file CLI entry point.
 */

import chalk from 'chalk';
import i18next from 'i18next';

import { ProgramContext } from './program-context';
import { handleStatement } from './handlers/handle-statement';
import { handleZipping } from './handlers/handle-zipping';
import { handleNotice } from './handlers/handle-notice';

const main = async () => {
    try {
        const context = new ProgramContext();

        await handleStatement(context);
        await handleZipping(context);
        // FIXME: Verify the zip file.
        await handleNotice(context);
    } catch (error: unknown) {
        console.error(chalk.red(i18next.t('fatalError')));

        if (error instanceof Error) {
            console.error(chalk.red(error.message));
        } else {
            console.error(chalk.red(JSON.stringify(error)));
        }
    }
};

main();
