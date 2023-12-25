import { i18next } from '../i18n';

const REPLACE_MAP = new Map<string, string>([
    ['{{name}}', '(?<name>.+)'],
    ['{{course}}', '(?<course>.+)'],
    ['{{year}}', '(?<year>[^\n]+)'],
    ['{{task}}', '(?<task>.+)'],
]);

export const getStatementData = (content: string) => {
    // Get available languages from i18next
    const languages = Object.keys(i18next.options?.resources || {});

    const pattern = languages.map((language) => {
        // TODO: escape regex special characters
        const statementPattern = i18next.getResource(language, 'translation', 'statement');

        let statementRegexPattern = statementPattern;

        for (const [key, value] of REPLACE_MAP) {
            statementRegexPattern = statementRegexPattern.replace(key, value);
        }

        return statementRegexPattern;
    });

    return '/^' + pattern.join('|') + '$/';
};
