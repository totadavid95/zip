/**
 * @file Statement parser and generator.
 */

import escapeStringRegexp from 'escape-string-regexp';
import zod from 'zod';
import { format } from 'date-fns';
import i18next, { t } from 'i18next';

const REPLACE_MAP = new Map<string, string>([
    ['{{name}}', '(?<name>.+)'],
    ['{{neptun}}', '(?<neptun>[a-zA-Z0-9]{6})'],
    ['{{course}}', '(?<course>.+)'],
    ['{{date}}', '(?<date>\\d{4}\\.\\s?\\d{2}\\.\\s?\\d{2}\\.)'],
    ['{{task}}', '(?<task>.+)'],
]);

export const nameAndNeptunSchema = zod.object({
    name: zod.string().trim().min(2),
    neptun: zod
        .string()
        .trim()
        .regex(/^[a-zA-Z0-9]{6}$/),
});

const statementDataSchema = nameAndNeptunSchema.extend({
    course: zod.string().trim().min(1),
    date: zod.string().trim(),
    task: zod.string().trim().min(1),
});

export type NameAndNeptun = zod.infer<typeof nameAndNeptunSchema>;

export type StatementData = zod.infer<typeof statementDataSchema>;

/**
 * Extracts statement data from the given content based on the defined patterns in the i18next resources.
 *
 * @param content The content to extract statement data from.
 * @returns The extracted statement data, or `undefined` if no match is found.
 */
export const parseStatement = (content: string): StatementData | undefined => {
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

/**
 * Formats the given date to the format used in the statement template.
 *
 * @param date The date to format.
 * @returns The formatted date.
 */
const formatDate = (date: Date): string => {
    return format(date, 'yyyy. MM. dd.');
};

/**
 * Fills the statement template with the given data. If the data does not contain a date, the current date will be
 * used.
 *
 * @param data The data to fill the statement template with.
 * @returns The filled statement.
 * @throws {zod.ZodError} If the data is invalid.
 */
export const generateStatement = (data: Partial<StatementData>): string => {
    if (!('date' in data)) {
        data.date = formatDate(new Date());
    }

    const parsedData = statementDataSchema.parse(data);
    const statement = t('statement', parsedData);

    return statement;
};
