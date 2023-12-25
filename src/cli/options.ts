/**
 * @file Program options.
 */

import { Command } from 'commander';
import zod from 'zod';

import { COMMA } from '../common/constants';
import i18next, { changeLanguage, t } from 'i18next';

const DEFAULT_OUTDIR = 'zipfiles';
const DEFAULT_IGNORES = ['node_modules', 'vendor', '.git', '.DS_Store', '.idea', '.vscode'];

const programOptionsSchema = zod
    .object({
        task: zod.string().trim().min(1),
        course: zod.string().trim().min(1),
        outdir: zod.string().trim().min(1),
        verify: zod.boolean(),
        ignore: zod.array(zod.string()),
        language: zod.string(),
    })
    .strict();

export type ProgramOptions = zod.infer<typeof programOptionsSchema>;

/**
 * Get program options.
 *
 * @returns Program options.
 * @throws {zod.ZodError} If the options are invalid.
 */
export const getProgramOptions = (): ProgramOptions => {
    const program = new Command();
    const supportedLanguages = new Set(['auto', ...Object.keys(i18next.options?.resources || {})]);

    // Special case: -l and --language affects Commander's help output, so we need to define it before the other options.
    // TODO: Find a better solution.
    let language = undefined;
    for (let i = 0; i < process.argv.length; i++) {
        const arg = process.argv[i];
        if (arg === '-l' || arg === '--language') {
            if (language) {
                throw new Error(t('duplicatedLanguageOption'));
            }
            language = process.argv[i + 1].toLowerCase();
            process.argv.splice(i, 2);
        }
    }

    // Check if the language is supported
    if (language) {
        if (!supportedLanguages.has(language)) {
            throw new Error(t('unsupportedLanguage', { language }));
        }
        changeLanguage(language);
    }

    program
        .requiredOption('-t, --task <name>', t('taskOptionDescription'))
        .requiredOption('-c, --course <name>', t('courseOptionDescription'))
        .option('-o, --outdir <name>', t('outputDirOptionDescription'), DEFAULT_OUTDIR)
        .option('-i, --ignore <paths...>', t('ignoreOptionDescription'), (value) => value.split(COMMA), DEFAULT_IGNORES)
        .option('--no-verify', t('noVerifyOptionDescription'))
        .option('-l, --language <language>', t('language'), (value) => value.toLowerCase(), language)
        .parse(process.argv);

    // Output dir is always ignored, as it makes no sense to include it in the zip file.
    const options = program.opts();
    if (options.outdir) {
        options.ignore.push(options.outdir);
    }

    return programOptionsSchema.parse(options);
};
