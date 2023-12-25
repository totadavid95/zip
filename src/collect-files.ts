import ignore from 'ignore';
import normalizePath from 'normalize-path';
import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const IGNORE_FILE_NAME = '.zipignore';

/**
 * Get ignore patterns from the specified directory.
 *
 * @param dir Directory path.
 * @returns Ignore patterns.
 */
const getIgnorePatterns = (dir: string): string[] => {
    const patterns = [];
    const ignoreFile = join(dir, IGNORE_FILE_NAME);

    if (existsSync(ignoreFile) && statSync(ignoreFile).isFile()) {
        const content = readFileSync(ignoreFile, 'utf8');
        const lines = content
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        patterns.push(...lines);
    }

    return patterns;
};

/**
 * Collect all files from a directory recursively, excluding specified patterns.
 *
 * @param dir Directory path.
 * @returns Collected files.
 */
export const collectFiles = (dir: string): string[] => {
    const collectFilesInternal = (subDir: string, ignores: string[] = []): string[] => {
        const files: string[] = [];
        const entries = readdirSync(subDir, { withFileTypes: true });

        const ignoredPaths: string[] = [...ignores, ...getIgnorePatterns(subDir)];
        const ignoreInstance = ignore().add(ignoredPaths);

        for (const entry of entries) {
            const relativePath = relative(dir, join(subDir, entry.name));

            if (ignoreInstance.ignores(entry.name) || ignoreInstance.ignores(relativePath) || entry.isSymbolicLink()) {
                continue;
            }

            if (entry.isDirectory()) {
                files.push(...collectFilesInternal(join(subDir, entry.name), ignoredPaths));
            } else if (entry.isFile()) {
                files.push(normalizePath(relativePath));
            }
        }

        return files;
    };

    return collectFilesInternal(dir);
};
