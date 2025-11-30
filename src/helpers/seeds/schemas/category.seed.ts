import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function createCategories(count = 5) {
    console.log(`Seeding ${count} categories...`);
    for (let i = 0; i < count; i++) {
        await prisma.category.create({
            data: {
                title: faker.commerce.department() + ' ' + i,
            },
        });
    }
    console.log('Categories seeded successfully!');
}
