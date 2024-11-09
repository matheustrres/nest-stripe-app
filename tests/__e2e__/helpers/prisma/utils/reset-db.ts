import { prismaClient } from '../prisma.client';

export async function resetDb(): Promise<void> {
	try {
		await prismaClient.$transaction([]);
	} catch (error) {
		console.error('Error while reseting database: ', error);
		throw error;
	}
}
