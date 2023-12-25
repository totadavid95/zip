import { Ignore } from 'ignore';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Collect all files from a directory recursively
 *
 * @param dir Directory path
 * @param ignores Ignore patterns
 * @returns Collected files
 */
export const collectFiles = (dir: string, ignores: Ignore): string[] => {
    const files: string[] = [];

    // Read all files from directory
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const path = join(dir, entry.name);

        if (ignores.ignores(path) || entry.isSymbolicLink()) {
            continue;
        }

        if (entry.isDirectory()) {
            files.push(...collectFiles(path, ignores));
        } else {
            files.push(path);
        }
    }

    return files;
};
