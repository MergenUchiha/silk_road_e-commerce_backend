import { Injectable } from '@nestjs/common';
import {
    CreateRegionDto,
    TApiRegionResponse,
    TApiRegionsResponse,
    UpdateRegionDto,
} from 'src/libs/contracts';
import {
    RegionAlreadyExistsException,
    RegionNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
    constructor(private prisma: PrismaService) {}

    async createRegion(
        dto: CreateRegionDto,
    ): Promise<TApiResp<TApiRegionResponse>> {
        await this.checkRegionExistence(dto.name);
        const region = await this.prisma.region.create({
            data: { name: dto.name },
        });
        return {
            good: true,
            response: region,
        };
    }

    async getRegions(): Promise<TApiResp<TApiRegionsResponse>> {
        const regions = await this.prisma.region.findMany();
        return { good: true, response: regions };
    }

    async updateRegion(
        regionId: string,
        dto: UpdateRegionDto,
    ): Promise<TApiResp<TApiRegionResponse>> {
        await this.findRegionById(regionId);
        await this.checkRegionExistence(dto.name);
        const region = await this.prisma.region.update({
            where: { id: regionId },
            data: { name: dto.name },
        });
        return { good: true, response: region };
    }

    async deleteRegion(regionId: string): Promise<TApiResp<true>> {
        await this.findRegionById(regionId);
        await this.prisma.region.delete({ where: { id: regionId } });
        return { good: true };
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

    private async checkRegionExistence(name: string) {
        const region = await this.prisma.region.findUnique({
            where: { name: name },
        });
        if (region) {
            throw new RegionAlreadyExistsException();
        }
    }
}
