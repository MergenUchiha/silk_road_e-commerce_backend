import { Injectable } from '@nestjs/common';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import {
    CreateShopDto,
    PageDto,
    ShopResponseSchema,
    ShopsResponseSchema,
    TApiShopResponse,
    TApiShopsResponse,
    UpdateShopDto,
} from 'src/libs/contracts';
import {
    ImageNotFoundException,
    RegionNotFoundException,
    ShopNameAlreadyExistsException,
    ShopNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { MediaService } from 'src/libs/media/media.service';
import { RedisService } from 'src/libs/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShopService {
    constructor(
        private prisma: PrismaService,
        private mediaService: MediaService,
        private redis: RedisService,
    ) {}

    async createShop(
        dto: CreateShopDto,
        userId: string,
    ): Promise<TApiResp<TApiShopResponse>> {
        await this.isNameExist(dto.name);
        await this.findRegionById(dto.regionId);
        const shop = await this.prisma.shop.create({
            data: {
                name: dto.name,
                description: dto.description,
                regionId: dto.regionId,
                contacts: dto.contacts,
                userId: userId,
                cityDistrict: dto.cityDistrict,
            },
        });
        const parsed = ShopResponseSchema.parse(shop);
        return {
            good: true,
            response: parsed,
        };
    }

    async getShops(query: PageDto): Promise<TApiResp<TApiShopsResponse>> {
        const { page = 1, take = 5, q = '' } = query;
        const shops = await this.prisma.shop.findMany({
            where: { name: { contains: q } },
            orderBy: { name: 'asc' },
            take,
            skip: (page - 1) * take,

            include: { images: true, products: true },
        });
        const parsed = ShopsResponseSchema.parse(shops);
        return { good: true, response: parsed };
    }

    async getOneShop(
        shopId: string,
        userIdentifier: string,
    ): Promise<TApiResp<TApiShopResponse>> {
        const prefix = 'shop_views';
        const cacheKey = `${shopId}:${userIdentifier}`;
        let hasViewed = false;

        hasViewed = !!(await this.redis.get(prefix, cacheKey));

        if (!hasViewed) {
            await this.prisma.shop.update({
                where: { id: shopId },
                data: { views: { increment: 1 } },
            });

            await this.redis.setWithExpiry(
                prefix,
                cacheKey,
                'true',
                24 * 60 * 60,
            );
        }

        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
            include: {
                images: true,
                products: { include: { images: true } },
            },
        });
        if (!shop) {
            throw new ShopNotFoundException();
        }
        const parsed = ShopResponseSchema.parse(shop);
        return { good: true, response: parsed };
    }

    async updateShop(
        shopId: string,
        dto: UpdateShopDto,
    ): Promise<TApiResp<TApiShopResponse>> {
        await this.findShopById(shopId);
        if (dto.name) {
            await this.isNameExist(dto.name);
        }
        const shop = await this.prisma.shop.update({
            where: { id: shopId },
            data: { ...dto },
        });
        const parsed = ShopResponseSchema.parse(shop);
        return {
            good: true,
            response: parsed,
        };
    }

    async deleteShop(shopId: string): Promise<TApiResp<true>> {
        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
            include: {
                images: {
                    select: { id: true },
                },
                products: {
                    include: {
                        images: {
                            select: { id: true },
                        },
                    },
                },
            },
        });
        if (!shop) {
            throw new ShopNotFoundException();
        }
        const imageIdsToDelete: string[] = [
            ...shop.images.map((image) => image.id),
            ...shop.products.flatMap((product) =>
                product.images.map((image) => image.id),
            ),
        ];
        if (imageIdsToDelete.length > 0) {
            await this.mediaService.deleteMedias(imageIdsToDelete);
        }
        await this.prisma.product.deleteMany({
            where: { shopId: shopId },
        });
        await this.prisma.shop.delete({
            where: { id: shopId },
        });

        return {
            good: true,
        };
    }

    async uploadShopImage(
        shopId: string,
        files: { image?: ITransformedFile; logo?: ITransformedFile },
    ): Promise<TApiResp<true>> {
        // Validate shop existence
        await this.findShopById(shopId);

        // Process image if provided
        if (files.image) {
            files.image.shopId = shopId;
            await this.mediaService.createShopFileMedia(files.image, false);
        }

        // Process logo if provided
        if (files.logo) {
            files.logo.shopId = shopId;
            await this.mediaService.createShopFileMedia(files.logo, true);
        }

        return { good: true };
    }

    async deleteShopImage(imageId: string): Promise<TApiResp<true>> {
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

    private async findShopById(shopId: string) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
        });
        if (!shop) {
            throw new ShopNotFoundException();
        }
        return shop;
    }

    private async findRegionById(regionId: string) {
        const region = await this.prisma.region.findUnique({
            where: { id: regionId },
        });
        if (!region) {
            throw new RegionNotFoundException();
        }
        return region;
    }

    private async isNameExist(name: string) {
        const shop = await this.prisma.shop.findUnique({ where: { name } });
        if (shop) {
            throw new ShopNameAlreadyExistsException();
        }
    }
}
