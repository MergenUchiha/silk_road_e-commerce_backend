// prisma/seed/reviews.seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function createReviews(count = 50) {
    console.log(`Seeding ${count} reviews...`);

    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();

    if (users.length === 0) {
        console.error('No users found. Seed users first!');
        return;
    }

    if (products.length === 0) {
        console.error('No products found. Seed products first!');
        return;
    }

    for (let i = 0; i < count; i++) {
        const user = faker.helpers.arrayElement(users);
        const product = faker.helpers.arrayElement(products);

        await prisma.review.create({
            data: {
                rating: faker.number.int({ min: 1, max: 5 }),
                comment: faker.lorem.sentences({ min: 1, max: 3 }),
                userId: user.id,
                productId: product.id,
            },
        });
    }

    console.log('Reviews seeded successfully!');
}
