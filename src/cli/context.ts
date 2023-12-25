/**
 * @file Program context.
 */

import chalk from 'chalk';
import { t } from 'i18next';

import { ProgramOptions, getProgramOptions } from './options';
import { StatementData, nameAndNeptunSchema } from '../statement';
import { EMPTY_STRING } from '../common/constants';

/**
 * Program context.
 */
export class ProgramContext {
    public readonly options: ProgramOptions;

    private step: number = 0;

    public name: string = EMPTY_STRING;

    public neptun: string = EMPTY_STRING;

    /**
     * Constructor.
     */
    constructor() {
        this.options = getProgramOptions();
    }

    /**
     * Print the next step to the console.
     *
     * @param title Title of the next step.
     */
    public printNextStep(title: string): void {
        console.log(EMPTY_STRING);
        console.log(chalk.bgGray.black(t('step', { step: ++this.step, title })));
        console.log(EMPTY_STRING);
    }

    /**
     * Set the name and neptun of the student.
     *
     * @param data Name and neptun data.
     * @throws Error if the name or neptun is invalid.
     */
    public setNameAndNeptun(data: Partial<StatementData>): void {
        const parsedData = nameAndNeptunSchema.parse(data);

        this.name = parsedData.name;
        this.neptun = parsedData.neptun;
    }
}
