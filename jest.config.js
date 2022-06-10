/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      diagnostics: {
        // Temporary disable type checking during test runs.
        // TODO: fix when the issue is resolved: https://github.com/kulshekhar/ts-jest/issues/943
        exclude: ['**'],
      },
    },
  }
};
