import { Injectable } from '@nestjs/common';
import {
    CreateAdvertisementDto,
    TApiAdvertisementResponse,
    TApiAdvertisementsResponse,
    UpdateAdvertisementDto,
} from 'src/libs/contracts';
import {
    AdvertisementAlreadyExistsException,
    AdvertisementNotFoundException,
    ProductNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdvertisementService {
    constructor(private prisma: PrismaService) {}

    async addAdvertisement(
        dto: CreateAdvertisementDto,
    ): Promise<TApiResp<TApiAdvertisementResponse>> {
        await this.findProductById(dto.productId);
        await this.checkAdvertisementExistences(dto.productId);
        const advertisement = await this.prisma.advertisement.create({
            data: { expiredDate: dto.expiredDate, productId: dto.productId },
        });

        return {
            good: true,
            response: advertisement,
        };
    }

    async getAllAdvertisements(): Promise<
        TApiResp<TApiAdvertisementsResponse>
    > {
        const advertisements = await this.prisma.advertisement.findMany();
        return {
            good: true,
            response: advertisements,
        };
    }

    async updateAdvertisement(
        advertisementId: string,
        dto: UpdateAdvertisementDto,
    ): Promise<TApiResp<TApiAdvertisementResponse>> {
        await this.findAdvertisementById(advertisementId);
        const advertisement = await this.prisma.advertisement.update({
            where: { id: advertisementId },
            data: { expiredDate: dto.expiredDate },
        });

        return {
            good: true,
            response: advertisement,
        };
    }

    async deleteAdvertisement(
        advertisementId: string,
    ): Promise<TApiResp<true>> {
        await this.findAdvertisementById(advertisementId);
        await this.prisma.advertisement.delete({
            where: { id: advertisementId },
        });
        return {
            good: true,
        };
    }

    private async findAdvertisementById(advertisementId: string) {
        const advertisement = await this.prisma.advertisement.findUnique({
            where: { id: advertisementId },
        });
        if (!advertisement) {
            throw new AdvertisementNotFoundException();
        }
        return advertisement;
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

    private async checkAdvertisementExistences(productId: string) {
        const advertisement = await this.prisma.advertisement.findUnique({
            where: { productId: productId },
        });
        if (advertisement) {
            throw new AdvertisementAlreadyExistsException();
        }
    }
}
