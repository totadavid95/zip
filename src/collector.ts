/**
 * @file File collector.
 */

import ignore from 'ignore';
import normalizePath from 'normalize-path';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

import { IGNORE_FILE_NAME, RE_NL } from './common/constants';
import { pathExists } from './utils/files';

/**
 * Get ignore patterns from the specified directory.
 *
 * @param dir Directory path.
 * @returns Ignore patterns.
 */
const getIgnorePatterns = async (dir: string): Promise<string[]> => {
    const patterns = [];
    const ignoreFile = join(dir, IGNORE_FILE_NAME);

    if ((await pathExists(ignoreFile)) && (await stat(ignoreFile)).isFile()) {
        const content = await readFile(ignoreFile, 'utf8');
        const lines = content
            .trim()
            .split(RE_NL)
            .map((line) => line.trim())
            .filter((line) => line.length);
        patterns.push(...lines);
    }

    return patterns;
};

/**
 * Collect all files from a directory recursively, excluding ignored files based on .zipignore files.
 *
 * @param dir Directory path.
 * @returns Collected files.
 */
export const collectFiles = async (dir: string, defaultIgnores: string[] = []): Promise<string[]> => {
    const collectFilesInternal = async (subDir: string, ignores: string[] = defaultIgnores): Promise<string[]> => {
        const files: string[] = [];
        const entries = await readdir(subDir, { withFileTypes: true });

        const ignoredPaths: string[] = [...ignores, ...(await getIgnorePatterns(subDir))];
        const ignoreInstance = ignore().add(ignoredPaths);

        for (const entry of entries) {
            const relativePath = relative(dir, join(subDir, entry.name));

            if (ignoreInstance.ignores(entry.name) || ignoreInstance.ignores(relativePath) || entry.isSymbolicLink()) {
                continue;
            }

            if (entry.isDirectory()) {
                files.push(...(await collectFilesInternal(join(subDir, entry.name), ignoredPaths)));
            } else if (entry.isFile()) {
                files.push(normalizePath(relativePath));
            }
        }

        return files;
    };

    return collectFilesInternal(dir);
};
