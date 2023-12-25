import { join } from 'node:path';
import { getStatementData } from '../src/statement/get-statement-data';
import { readFile } from 'node:fs/promises';

describe('Get statement data', () => {
    it.each([
        {
            fixture: 'statement-data/statement.hu.txt',
            expected: {
                name: 'Hát Izsák',
                neptun: '123abc',
                course: 'Webprogramozás',
                task: 'PHP beadandó',
                date: '2023. 11. 30.',
            },
        },
        {
            fixture: 'statement-data/statement.en.txt',
            expected: {
                name: 'John Doe',
                neptun: 'ABC123',
                course: 'Web Programming',
                task: 'PHP assignment',
                date: '2023. 11. 30.',
            },
        },
    ])(`should get statement data from 'fixtures/$fixture'`, async ({ fixture, expected }) => {
        const path = join(__dirname, `./fixtures/${fixture}`);
        const content = await readFile(path, 'utf8');

        expect(getStatementData(content)).toEqual(expected);
    });
});
