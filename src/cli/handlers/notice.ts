/**
 * @file Notice handler.
 */

import chalk from 'chalk';
import { t } from 'i18next';

import { ProgramContext } from '../context';
import { RE_NL } from '../../common/constants';

export const handleNotice = async (context: ProgramContext): Promise<void> => {
    context.printNextStep(t('stepHandleNotice'));
    t('notice')
        .split(RE_NL)
        .forEach((line) => console.log(chalk.yellow(line)));
    return;
};
