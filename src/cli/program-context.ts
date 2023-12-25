/**
 * @file Program context.
 */

import i18next from 'i18next';
import { ProgramOptions, getProgramOptions } from './program-options';
import chalk from 'chalk';
import { EMPTY_STRING } from '../common/constants';
import { StatementData, nameAndNeptunSchema } from '../statement';

export class ProgramContext {
    public readonly options: ProgramOptions;
    private step: number;
    public name: string = '';
    public neptun: string = '';

    constructor() {
        this.options = getProgramOptions();
        this.step = 0;
    }

    public printNextStep(title: string): void {
        console.log(EMPTY_STRING);
        console.log(chalk.bgGray.black(i18next.t('step', { step: ++this.step, title })));
        console.log(EMPTY_STRING);
    }

    public setNameAndNeptun(data: Partial<StatementData>): void {
        const parsedData = nameAndNeptunSchema.parse(data);

        this.name = parsedData.name;
        this.neptun = parsedData.neptun;
    }
}
