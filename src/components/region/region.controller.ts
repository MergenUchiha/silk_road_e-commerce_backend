import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { RegionService } from './region.service';
import {
    CreateRegionDto,
    TApiRegionResponse,
    TApiRegionsResponse,
    UpdateRegionDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { ApiTags } from '@nestjs/swagger';
import { CreateRegionOperation } from './decorator/createRegionOperation.decorator';
import { GetRegionsOperation } from './decorator/getRegionsOperation.decorator';
import { UpdateRegionOperation } from './decorator/updateRegionOperation.decorator';
import { DeleteRegionOperation } from './decorator/deleteRegionOperation.decorator';

@ApiTags('region')
@Controller('region')
export class RegionController {
    constructor(private regionService: RegionService) {}

    @CreateRegionOperation()
    @Post()
    async createRegion(
        @Body() dto: CreateRegionDto,
    ): Promise<TApiResp<TApiRegionResponse>> {
        return await this.regionService.createRegion(dto);
    }

    @GetRegionsOperation()
    @Get()
    async getRegions(): Promise<TApiResp<TApiRegionsResponse>> {
        return await this.regionService.getRegions();
    }

    @UpdateRegionOperation()
    @Patch(':regionId')
    async updateRegion(
        @Param('regionId', ParseUUIDPipe) regionId: string,
        @Body() dto: UpdateRegionDto,
    ) {
        return await this.regionService.updateRegion(regionId, dto);
    }

    @DeleteRegionOperation()
    @Delete(':regionId')
    async deleteRegion(@Param('regionId', ParseUUIDPipe) regionId: string) {
        return await this.regionService.deleteRegion(regionId);
    }
}
