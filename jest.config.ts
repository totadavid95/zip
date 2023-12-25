import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    testTimeout: 30000,
    testMatch: ['**/test/**/*.test.ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
};

export default config;
