/**
 * @file ZIP file generation.
 */

import AdmZip from 'adm-zip';
import slugify from 'slugify';
import { format } from 'date-fns';
import { parse } from 'node:path';

import { collectFiles } from './collector';
import { EXT_ZIP, HYPHEN, UNDERSCORE } from './common/constants';

/**
 * Generate a ZIP file name.
 *
 * @param name Student name.
 * @param neptun Student Neptun code.
 * @param task Task name.
 * @returns ZIP file name.
 */
export const generateZipFileName = (name: string, neptun: string, task: string): string => {
    const result: string[] = [];
    const date = new Date();

    result.push(format(date, 'yyyyMMdd-HHmmss'));
    result.push(slugify(name, { replacement: HYPHEN, lower: true }));
    result.push(neptun.toLowerCase());
    result.push(slugify(task, { replacement: HYPHEN, lower: true }));

    return result.join(UNDERSCORE) + EXT_ZIP;
};

/**
 * Zip all files from a directory recursively, excluding ignored files based on .zipignore files.
 * You can specify additional ignores, like `node_modules`.
 *
 * @param dir Directory path.
 * @returns ZIP file.
 */
export const zipFiles = async (dir: string, defaultIgnores: string[] = []): Promise<AdmZip> => {
    const zip = new AdmZip();
    const filePaths = await collectFiles(dir, defaultIgnores);

    for (const filePath of filePaths) {
        zip.addLocalFile(filePath, parse(filePath).dir);
    }

    return zip;
};
