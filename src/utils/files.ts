/**
 * @file File utilities.
 */

import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

/**
 * Calculate an MD5 checksum of a file.
 *
 * @param filePath File path.
 * @returns Calculated checksum.
 */
export const getFileChecksum = async (filePath: string): Promise<string> => {
    const content = await readFile(filePath, 'utf8');
    return createHash('md5').update(content).digest('hex');
};

/**
 * Check if a path exists.
 *
 * @param path Path.
 * @returns `true` if the path exists, `false` otherwise.
 */
export const pathExists = async (path: string): Promise<boolean> => {
    return stat(path)
        .then(() => true)
        .catch(() => false);
};
