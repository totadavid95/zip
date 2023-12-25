/**
 * @file Zipping handler.
 */

import chalk from 'chalk';
import { t } from 'i18next';
import { filesize } from 'filesize';
import { join } from 'node:path';
import { mkdir, stat } from 'node:fs/promises';

import { ProgramContext } from '../context';
import { generateZipFileName, zipFiles } from '../../zip';
import { pathExists } from '../../utils/files';

export const handleZipping = async (context: ProgramContext): Promise<void> => {
    context.printNextStep(t('stepHandleZipping'));

    const cwd = process.cwd();
    let step = 0;

    process.stdout.write(` ${++step}. ${t('zippingFiles')}... `);
    const zip = await zipFiles(cwd, context.options.ignore);
    console.log(chalk.green(t('done')));

    const zipFileName = generateZipFileName(context.name, context.neptun, context.options.task);
    const outDir = join(cwd, context.options.outdir);
    const zipFilePath = join(outDir, zipFileName);

    if (!(await pathExists(outDir))) {
        process.stdout.write(` ${++step}. ${t('creatingOutputDir', { path: chalk.yellow(outDir) })}... `);
        await mkdir(outDir, { recursive: true });
        console.log(chalk.green(t('done')));
    }

    process.stdout.write(` ${++step}. ${t('writingZipFile', { path: chalk.yellow(zipFilePath) })}... `);
    zip.writeZip(zipFilePath);
    const size = filesize((await stat(zipFilePath)).size);
    console.log(`${chalk.green(t('done'))} (${t('size', { size: chalk.yellow(size) })})`);
    return;
};
