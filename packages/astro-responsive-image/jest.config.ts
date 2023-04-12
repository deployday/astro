/* eslint-disable */
import type { Config } from 'jest';
import { defaults } from 'jest-config';
const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'html'],
  displayName: 'astro-responsive-image',
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'lcov'],
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  coverageDirectory: '<rootDir>/../../coverage/packages/astro-responsive-image',
};
export default config;
