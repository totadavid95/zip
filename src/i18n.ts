/**
 * @file Internationalization (i18n).
 */

import I18nextCLILanguageDetector from 'i18next-cli-language-detector';
import YAML from 'yaml';
import { use, Resource } from 'i18next';
import { join, parse, dirname } from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { EXT_YAML } from './common/constants';

const __dirname = dirname(fileURLToPath(import.meta.url));

const LOCALES_DIR = join(__dirname, './locales');
const FALLBACK_LOCALE = 'en';

/**
 * Load all resources from locales directory.
 *
 * @param dir Locales directory path.
 * @returns i18next-compatible resource object with translations.
 */
const loadResources = async (dir: string): Promise<Resource> => {
    const resources: Resource = {};
    const files = await readdir(dir);

    for (const file of files) {
        const { name, ext } = parse(file);

        if (ext !== EXT_YAML) {
            continue;
        }

        const locale = await readFile(join(dir, file), 'utf8');

        resources[name] = {
            translation: YAML.parse(locale),
        };
    }

    return resources;
};

/**
 * Initialize i18next.
 */
export const initializeI18n = async (): Promise<void> => {
    // Initialize i18next
    use(I18nextCLILanguageDetector).init({
        resources: await loadResources(LOCALES_DIR),
        fallbackLng: FALLBACK_LOCALE,
    });
};
