/**
 * @file Statement handler.
 */

import chalk from 'chalk';
import i18next from 'i18next';
import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

import { ProgramContext } from '../context';
import { STATEMENT_FILE_NAME } from '../../common/constants';
import { StatementData, generateStatement, parseStatement } from '../../statement';
import { pathExists } from '../../utils/files';
import { statementForm } from '../forms/statement';

export const handleStatement = async (context: ProgramContext): Promise<void> => {
    context.printNextStep(i18next.t('stepHandleStatement'));

    const statementPath = join(process.cwd(), STATEMENT_FILE_NAME);

    if (await pathExists(statementPath)) {
        const content = await readFile(statementPath, 'utf-8');
        const data = parseStatement(content);

        if (!data) {
            throw new Error(i18next.t('statementExistentButInvalid', { statement: chalk.yellow(statementPath) }));
        }

        console.log(
            chalk.green(
                i18next.t('statementExistentAndValid', {
                    name: chalk.yellow(data.name),
                    neptun: chalk.yellow(data.neptun),
                    statement: chalk.yellow(statementPath),
                }),
            ),
        );
        context.setNameAndNeptun(data);
        return;
    }

    const nameAndNeptun = await statementForm();
    context.setNameAndNeptun(nameAndNeptun);
    const data: Partial<StatementData> = {
        ...nameAndNeptun,
        course: context.options.course,
        task: context.options.task,
    };
    const filledStatement = generateStatement(data);
    await writeFile(statementPath, filledStatement);
    console.log(chalk.green(i18next.t('statementCreated', { path: chalk.yellow(statementPath) })));
    return;
};
