/**
 * @file Notice handler.
 */

import chalk from 'chalk';
import i18next from 'i18next';

import { ProgramContext } from '../program-context';
import { RE_NL } from '../../common/constants';

export const handleNotice = async (context: ProgramContext): Promise<void> => {
    context.printNextStep(i18next.t('stepHandleNotice'));
    i18next
        .t('notice')
        .split(RE_NL)
        .forEach((line) => console.log(chalk.yellow(line)));
    return;
};
