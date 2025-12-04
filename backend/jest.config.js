export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['**/__tests__/**/*.test.js'],
    moduleFileExtensions: ['js', 'mjs'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    testTimeout: 30000,
    setupFilesAfterEnv: ['./tests/setup.js'],
    // Coverage configuration
    collectCoverageFrom: [
        'controllers/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        'utils/**/*.js',
        '!**/node_modules/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'json-summary']
};
