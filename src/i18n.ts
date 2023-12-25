/**
 * @file Internationalization (i18n) management
 */

import I18nextCLILanguageDetector from 'i18next-cli-language-detector';
import YAML from 'yaml';
import i18next, { Resource } from 'i18next';
import { join, parse } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';

const LOCALES_DIR = join(__dirname, './locales');
const EXT_YAML = '.yaml';
const FALLBACK_LOCALE = 'en';

/**
 * Load all resources from locales directory
 *
 * @param dir Locales directory path
 * @returns Resources
 */
const loadResources = (dir: string): Resource => {
    const resources: Resource = {};

    // Read all files from locales directory
    const files = readdirSync(dir);

    for (const file of files) {
        const { name, ext } = parse(file);

        if (ext !== EXT_YAML) {
            continue;
        }

        const locale = readFileSync(join(dir, file), 'utf8');

        resources[name] = {
            translation: YAML.parse(locale),
        };
    }

    return resources;
};

// Initialize i18next
i18next.use(I18nextCLILanguageDetector).init({
    resources: loadResources(LOCALES_DIR),
    fallbackLng: FALLBACK_LOCALE,
});

export { i18next };
