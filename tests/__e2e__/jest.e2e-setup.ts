import { prismaClient } from './helpers/prisma/prisma.client';
import { deployDb, resetDb } from './helpers/prisma/utils';

beforeAll(async () => {
	await deployDb();
});

beforeEach(async () => {
	await resetDb();
});

afterAll(async () => {
	await resetDb();
	await prismaClient.$disconnect();
});
