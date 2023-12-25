/**
 * @file File utilities.
 */

import { stat } from 'fs/promises';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Calculate an MD5 checksum of a file.
 *
 * @param filePath File path.
 * @returns Calculated checksum.
 */
export const getFileChecksum = (filePath: string): string => {
    const content = readFileSync(filePath, 'utf8');
    return createHash('md5').update(content).digest('hex');
};

/**
 * Check if a path exists.
 *
 * @param path Path.
 * @returns True if the path exists, false otherwise.
 */
export const pathExists = async (path: string): Promise<boolean> => {
    return stat(path)
        .then(() => true)
        .catch(() => false);
};
