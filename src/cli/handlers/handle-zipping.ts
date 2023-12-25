/**
 * @file Zipping handler.
 */

import chalk from 'chalk';
import i18next from 'i18next';
import { filesize } from 'filesize';
import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { stat } from 'node:fs/promises';

import { ProgramContext } from '../program-context';
import { generateZipFileName, zipFiles } from '../../zip';
import { pathExists } from '../../utils/files';

export const handleZipping = async (context: ProgramContext): Promise<void> => {
    context.printNextStep(i18next.t('stepHandleZipping'));

    const cwd = process.cwd();
    let step = 0;

    process.stdout.write(` ${++step}. ${i18next.t('zippingFiles')}... `);
    const zip = await zipFiles(cwd, context.options.ignore);
    console.log(chalk.green(i18next.t('done')));

    const zipFileName = generateZipFileName(context.name, context.neptun, context.options.task);
    const outDir = join(cwd, context.options.outdir);
    const zipFilePath = join(outDir, zipFileName);

    if (!(await pathExists(outDir))) {
        process.stdout.write(` ${++step}. ${i18next.t('creatingOutputDir', { path: chalk.yellow(outDir) })}... `);
        await mkdir(outDir, { recursive: true });
        console.log(chalk.green(i18next.t('done')));
    }

    process.stdout.write(` ${++step}. ${i18next.t('writingZipFile', { path: chalk.yellow(zipFilePath) })}... `);
    zip.writeZip(zipFilePath);
    const size = filesize((await stat(zipFilePath)).size);
    console.log(`${chalk.green(i18next.t('done'))} (${i18next.t('size', { size: chalk.yellow(size) })})`);
    return;
};
