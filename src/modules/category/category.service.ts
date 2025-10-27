/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import {
    CreateCategoryDto,
    PageDto,
    CategoryResponseSchema,
    CategoriesResponseSchema,
    TApiCategoryResponse,
    TApiCategoriesResponse,
    UpdateCategoryDto,
} from 'src/libs/contracts';
import {
    CategoryNotFoundException,
    CategoryTitleAlreadyExistsException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { RedisService } from 'src/libs/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
    ) {}

    async createCategory(
        dto: CreateCategoryDto,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        await this.isTitleExist(dto.title);
        const category = await this.prisma.category.create({
            data: {
                title: dto.title,
            },
        });
        const parsed = CategoryResponseSchema.parse(category);
        return {
            good: true,
            response: parsed,
        };
    }

    async getCategories(
        query: PageDto,
    ): Promise<TApiResp<TApiCategoriesResponse>> {
        const { page = 1, take = 5, q = '' } = query;
        const categories = await this.prisma.category.findMany({
            where: { title: { contains: q } },
            orderBy: { title: 'asc' },
            take,
            skip: (page - 1) * take,

            include: { products: true },
        });
        const parsed = CategoriesResponseSchema.parse(categories);
        return { good: true, response: parsed };
    }

    async getOneCategory(
        categoryId: string,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: { include: { images: true } },
            },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }
        const parsed = CategoryResponseSchema.parse(category);
        return { good: true, response: parsed };
    }

    async updateCategory(
        categoryId: string,
        dto: UpdateCategoryDto,
    ): Promise<TApiResp<TApiCategoryResponse>> {
        await this.findCategoryById(categoryId);
        if (dto.title) {
            await this.isTitleExist(dto.title);
        }
        const category = await this.prisma.category.update({
            where: { id: categoryId },
            data: { ...dto },
        });
        const parsed = CategoryResponseSchema.parse(category);
        return {
            good: true,
            response: parsed,
        };
    }

    async deleteCategory(categoryId: string): Promise<TApiResp<true>> {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: {
                    include: {
                        images: {
                            select: { id: true },
                        },
                    },
                },
            },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }
        const imageIdsToDelete: string[] = [
            ...category.products.flatMap((product) =>
                product.images.map((image) => image.id),
            ),
        ];
        await this.prisma.product.deleteMany({
            where: { categoryId: categoryId },
        });
        await this.prisma.category.delete({
            where: { id: categoryId },
        });

        return {
            good: true,
        };
    }

    private async findCategoryById(categoryId: string) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new CategoryNotFoundException();
        }
        return category;
    }

    private async isTitleExist(title: string) {
        const category = await this.prisma.category.findUnique({
            where: { title },
        });
        if (category) {
            throw new CategoryTitleAlreadyExistsException();
        }
    }
}
