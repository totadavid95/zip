/**
 * @file Interactive statement form.
 */

import inquirer from 'inquirer';
import chalk from 'chalk';

import { NameAndNeptun } from '../../statement';
import { RE_NEPTUN, RE_NL, SPACE } from '../../common/constants';
import { t } from 'i18next';

/**
 * Interactive statement form.
 *
 * @returns Statement form data.
 */
export const statementForm = async (): Promise<NameAndNeptun> => {
    // Show statement preview
    const statement = t('statement');
    statement.split(RE_NL).forEach((line) => console.log(chalk.gray(line)));

    // Ask for confirmation
    const confirmation = await inquirer.prompt([
        {
            type: 'list',
            name: 'confirmation',
            message: t('statementConfirmationQuestion'),
            choices: [
                { name: t('accept'), value: true },
                { name: t('decline'), value: false },
            ],
        },
    ]);

    if (!confirmation.confirmation) {
        throw new Error(t('statementConfirmationDeclined'));
    }

    console.log(chalk.green(t('statementConfirmationAccepted')));

    // Ask for student name and neptun code
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: t('statementNameQuestion'),
            validate(name: string) {
                name = name.trim();
                if (name.length < 2) {
                    return t('statementNameTooShort', { min: 2 });
                }
                if (name.indexOf(SPACE) === -1) {
                    return t('statementNameMissingSpace');
                }
                return true;
            },
            filter(name: string) {
                return name
                    .split(SPACE)
                    .filter((part) => part.length)
                    .map((part) => {
                        const lowercase = part.toLowerCase();
                        return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
                    })
                    .join(SPACE);
            },
        },
        {
            type: 'input',
            name: 'neptun',
            message: t('statementNeptunQuestion'),
            validate(neptun: string) {
                neptun = neptun.trim();
                if (neptun.length !== 6) {
                    return t('statementNeptunLength');
                }
                if (!neptun.match(RE_NEPTUN)) {
                    return t('statementNeptunInvalid');
                }
                return true;
            },
            filter(neptun: string) {
                return neptun.toUpperCase();
            },
        },
    ];

    return await inquirer.prompt(questions);
};
