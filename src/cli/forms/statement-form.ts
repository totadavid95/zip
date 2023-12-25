/**
 * @file Interactive statement form.
 */

import { i18next } from '../../i18n';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { RE_NEPTUN, RE_NL, SPACE } from '../../common/constants';
import { NameAndNeptun } from '../../statement';

type StatementFormData = NameAndNeptun;

/**
 * Interactive statement form.
 *
 * @returns Statement form data.
 */
export const statementForm = async (): Promise<StatementFormData> => {
    // Show statement preview
    const statement = i18next.t('statement');
    statement.split(RE_NL).forEach((line) => console.log(chalk.gray(line)));

    // Ask for confirmation
    const confirmation = await inquirer.prompt([
        {
            type: 'list',
            name: 'confirmation',
            message: i18next.t('statementConfirmation'),
            choices: [
                { name: i18next.t('statementConfirmationAccept'), value: true },
                { name: i18next.t('statementConfirmationDecline'), value: false },
            ],
        },
    ]);

    if (!confirmation.confirmation) {
        throw new Error(i18next.t('statementConfirmationDeclined'));
    }

    console.log(chalk.green(i18next.t('statementConfirmationAccepted')));

    // Ask for student name and neptun code
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: i18next.t('statementNameQuestion'),
            validate(name: string) {
                name = name.trim();
                if (name.length < 2) {
                    return i18next.t('statementNameTooShort', { min: 2 });
                }
                if (name.indexOf(SPACE) === -1) {
                    return i18next.t('statementNameMissingSpace');
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
            message: i18next.t('statementNeptunQuestion'),
            validate(neptun: string) {
                neptun = neptun.trim();
                if (neptun.length !== 6) {
                    return i18next.t('statementNeptunLength');
                }
                if (!neptun.match(RE_NEPTUN)) {
                    return i18next.t('statementNeptunInvalid');
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
