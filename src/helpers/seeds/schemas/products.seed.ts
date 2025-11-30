// prisma/seed/products.seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function createProducts(count = 20) {
    console.log(`Seeding ${count} products...`);

    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        console.error('No categories found. Seed categories first!');
        return;
    }

    for (let i = 0; i < count; i++) {
        const category = faker.helpers.arrayElement(categories);
        await prisma.product.create({
            data: {
                title: faker.commerce.productName().slice(0, 25),
                description: faker.commerce.productDescription(),
                price: parseInt(faker.commerce.price({ min: 10, max: 1000 })),
                size: faker.string.alphanumeric({ length: 5 }), // исправлено
                categoryId: category.id,
                images: { create: [] },
            },
        });
    }

    console.log('Products seeded successfully!');
}
