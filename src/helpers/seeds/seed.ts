// prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { createCategories } from './schemas/category.seed';
import { createProducts } from './schemas/products.seed';
import { createReviews } from './schemas/review.seed';
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    await prisma.$connect();

    // Очистка перед сидом
    await prisma.product.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    await createCategories();
    await createProducts();
    await createReviews();

    await prisma.$disconnect();
    console.log('Seeding finished!');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
