/**
 * @file Checksum calculation.
 */

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Calculate an MD5 checksum of a file.
 *
 * @param filePath File path.
 * @returns Calculated checksum.
 */
export const getMd5FileChecksum = (filePath: string): string => {
    const content = readFileSync(filePath, 'utf8');
    return createHash('md5').update(content).digest('hex');
};
