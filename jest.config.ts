import { Config } from 'jest';

export default {
	rootDir: '.',
	roots: ['<rootDir>/tests/__unit__'],
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
		'#/(.+)': '<rootDir>/tests/$1',
		'@/app.controller': '<rootDir>/src/app.controller',
		'@/app.service': '<rootDir>/src/app.service',
		'@/app.module': '<rootDir>/src/app.module',
		'@/core/(.+)': '<rootDir>/src/@core/$1',
		'@/infra/(.+)': '<rootDir>/src/infra/$1',
		'@/modules/(.+)': '<rootDir>/src/modules/$1',
		'@/shared/(.+)': '<rootDir>/src/shared/$1',
		'@/(.+)': '<rootDir>/src/$1',
	},
} as Config;
