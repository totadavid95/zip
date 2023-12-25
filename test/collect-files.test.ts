import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectFiles } from '../src/collect-files';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('File collection', () => {
    it.each([
        {
            fixture: 'collect-files',
            expected: ['.zipignore', 'dir1/.zipignore', 'dir1/bar.md', 'dir1/subdir3/baz.md', 'foo.md'],
        },
    ])(`should collect files from 'fixtures/$fixture'`, ({ fixture, expected }) => {
        const dirPath = join(__dirname, `./fixtures/${fixture}`);
        const files = collectFiles(dirPath);

        expect(files).toEqual(expected);
    });
});
