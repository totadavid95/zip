/**
 * @file Program options.
 */

import { Command } from 'commander';
import zod from 'zod';

import { COMMA } from '../common/constants';

const DEFAULT_OUTDIR = 'zipfiles';
const DEFAULT_IGNORES = ['node_modules', 'vendor', '.git', '.DS_Store', '.idea', '.vscode'];

const programOptionsSchema = zod
    .object({
        task: zod.string().trim().min(1),
        course: zod.string().trim().min(1),
        outdir: zod.string().trim().min(1),
        verify: zod.boolean(),
        ignore: zod.array(zod.string()),
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

    program
        .requiredOption('-t, --task <name>', 'Specifies the task name (required)')
        .requiredOption('-c, --course <name>', 'Specifies the course name (required)')
        .option('-o, --outdir <name>', 'Specifies the output directory', DEFAULT_OUTDIR)
        .option(
            '-i, --ignore <paths...>',
            'Specifies the paths to ignore in addition to the ignores defined in .zipignore',
            (value) => value.split(COMMA),
            DEFAULT_IGNORES,
        )
        .option('--no-verify', 'Ignore verifying files after zipping')
        .parse(process.argv);

    // Output directory always should be ignored, because it is not make sense to zip it.
    const options = program.opts();
    if (options.outdir) {
        options.ignore.push(options.outdir);
    }

    return programOptionsSchema.parse(options);
};
