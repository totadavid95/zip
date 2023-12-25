import escapeStringRegexp from 'escape-string-regexp';
import zod from 'zod';
import { i18next } from '../i18n';

const REPLACE_MAP = new Map<string, string>([
    ['{{name}}', '(?<name>.+)'],
    ['{{neptun}}', '(?<neptun>[a-zA-Z0-9]{6})'],
    ['{{course}}', '(?<course>.+)'],
    ['{{date}}', '(?<date>\\d{4}\\.\\s?\\d{2}\\.\\s?\\d{2}\\.)'],
    ['{{task}}', '(?<task>.+)'],
]);

const statementDataSchema = zod
    .object({
        name: zod.string().trim().min(3),
        neptun: zod.string().trim().length(6),
        course: zod.string().trim().min(3),
        date: zod.string().trim(),
        task: zod.string().trim().min(3),
    })
    .strict();

type StatementData = zod.infer<typeof statementDataSchema>;

/**
 * Extracts statement data from the given content based on the defined patterns in the i18next resources.
 *
 * @param content The content to extract statement data from.
 * @returns The extracted statement data, or `undefined` if no match is found.
 */
export const getStatementData = (content: string): StatementData | undefined => {
    // Get available languages from i18next
    const languages = Object.keys(i18next.options?.resources || {});

    for (const language of languages) {
        // Get statement template text for the actual language (read 'statement' key from 'translation' object).
        // Trim it to remove leading and trailing whitespace (for example, extra newlines).
        // Escape special RegExp characters to prevent conflicts (for example, dots at the end of sentences are
        // special characters in RegExp).
        let statementPattern = escapeStringRegexp(i18next.getResource(language, 'translation', 'statement').trim());

        // Replace placeholders in the statement pattern with RegExp groups.
        // It is needed to escape special RegExp characters in the key, because for example, open and close curly
        // braces are special characters.
        for (const [key, value] of REPLACE_MAP) {
            statementPattern = statementPattern.replace(escapeStringRegexp(key), value);
        }

        // Create a regex from the pattern text and try to match it with the provided statement content.
        const regex = new RegExp(`^${statementPattern}`, 'm');
        const matches = content.trim().match(regex);

        if (matches?.groups) {
            try {
                return statementDataSchema.parse(matches.groups);
            } catch {
                // We have a match, but the parsed data is invalid.
                return undefined;
            }
        }
    }

    return undefined;
};
