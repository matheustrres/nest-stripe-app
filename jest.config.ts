import { type Config } from 'jest';

export default {
	roots: ['<rootDir>/tests/__unit__'],
	rootDir: '.',
	displayName: 'Unit test',
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: './coverage',
	clearMocks: true,
	verbose: true,
	detectOpenHandles: true,
	testEnvironment: 'node',
	moduleNameMapper: {
		'#/(.+)': '<rootDir>/test/$1',
		'@/app': '<rootDir>/src/app',
		'@/core/(.+)': '<rootDir>/src/core/$1',
		'@/modules/(.+)': '<rootDir>/src/modules/$1',
		'@/shared/(.+)': '<rootDir>/src/shared/$1',
	},
} as Config;
