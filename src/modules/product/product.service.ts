/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import {
    CreateImageDto,
    CreateProductDto,
    ImageResponseSchema,
    PageDto,
    ProductResponseSchema,
    ProductsResponseSchema,
    TApiProductResponse,
    TApiProductsResponse,
    UpdateProductDto,
} from 'src/libs/contracts';
import {
    ImageNotFoundException,
    ProductNotFoundException,
    CategoryNotFoundException,
    UserNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { MediaService } from 'src/libs/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
    ) {}
    private fileSchema = z.object({
        originalName: z.string().min(1, 'Original name is required'),
        fileName: z.string().min(1, 'File name is required'),
        filePath: z.string().min(1, 'File path is required'),
        mimeType: z.string().refine((val) => val.startsWith('image/'), {
            message: 'File must be an image',
        }),
        size: z.string().refine((val) => parseInt(val) <= 1500 * 1024 * 1024, {
            message: 'File size must be less than 1.5GB',
        }),
        productId: z.string().uuid().optional(),
    });
    async createProduct(
        dto: CreateProductDto,
    ): Promise<TApiResp<TApiProductResponse>> {
        await this.findCategoryById(dto.categoryId);
        const product = await this.prisma.product.create({ data: { ...dto } });
        const parsed = ProductResponseSchema.parse(product);
        return {
            good: true,
            response: parsed,
        };
    }

    async getProducts(query: PageDto): Promise<TApiResp<TApiProductsResponse>> {
        const { page = 1, take = 5, q = '' } = query;
        const products = await this.prisma.product.findMany({
            where: { title: { contains: q } },
            orderBy: { title: 'asc' },
            take,
            skip: (page - 1) * take,
            include: { images: true },
        });
        const count = await this.prisma.product.count();
        const parsed = ProductsResponseSchema.parse(products);
        console.log(parsed);
        return { good: true, response: parsed, count: count };
    }

    async getOneProduct(
        productId: string,
    ): Promise<TApiResp<TApiProductResponse>> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                images: true,
                reviews: { include: { user: true } },
            },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        const parsed = ProductResponseSchema.parse(product);
        return { good: true, response: parsed };
    }

    async updateProduct(
        productId: string,
        dto: UpdateProductDto,
    ): Promise<TApiResp<TApiProductResponse>> {
        await this.findProductById(productId);
        const product = await this.prisma.product.update({
            where: { id: productId },
            data: { ...dto },
        });
        const parsed = ProductResponseSchema.parse(product);
        return {
            good: true,
            response: parsed,
        };
    }

    async deleteProduct(productId: string): Promise<TApiResp<true>> {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                images: {
                    select: { id: true },
                },
            },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        const imageIdsToDelete: string[] = [
            ...product.images.map((image) => image.id),
        ];
        if (imageIdsToDelete.length > 0) {
            await this.mediaService.deleteMedias(imageIdsToDelete);
        }

        await this.prisma.product.delete({
            where: { id: productId },
        });

        return {
            good: true,
        };
    }

    async uploadProductImage(
        productId: string,
        file: ITransformedFile,
    ): Promise<TApiResp<{ id: string }>> {
        try {
            this.fileSchema.parse(file);
        } catch (error) {
            console.error('Validation failed:', error);
            throw new BadRequestException(error);
        }

        const mediaData: CreateImageDto = {
            originalName: file.originalName,
            fileName: file.fileName,
            filePath: file.filePath,
            mimeType: file.mimeType,
            size: file.size,
            productId: productId,
        };

        const media = await this.prisma.image.create({
            data: mediaData,
        });
        const parsed = ImageResponseSchema.parse(media);

        return {
            good: true,
            response: parsed,
        };
    }

    async deleteProductImage(imageId: string): Promise<TApiResp<true>> {
        await this.findImageById(imageId);
        await this.mediaService.deleteMedia(imageId);
        return { good: true };
    }

    private async findImageById(imageId: string) {
        const image = await this.prisma.image.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            throw new ImageNotFoundException();
        }
    }

    private async findProductById(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
        return product;
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

    private async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
    }
}
