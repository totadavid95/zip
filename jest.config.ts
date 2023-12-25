import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    testTimeout: 30000,
    testMatch: ['**/test/**/*.test.ts'],
    transform: { '.ts': '@swc/jest' },
    extensionsToTreatAsEsm: ['.ts'],
};

export default config;
