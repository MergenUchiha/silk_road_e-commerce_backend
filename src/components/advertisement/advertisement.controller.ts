import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdvertisementService } from './advertisement.service';
import {
    CreateAdvertisementDto,
    UpdateAdvertisementDto,
    TApiAdvertisementResponse,
    TApiAdvertisementsResponse,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { AddAdvertisementOperation } from './decorator/addAdvertisementOperation.decorator';
import { GetAllAdvertisementsOperation } from './decorator/getAllAdvertisementsOperation.decorator';
import { UpdateAdvertisementOperation } from './decorator/updateAdvertisementOperation.decorator';
import { DeleteAdvertisementOperation } from './decorator/deleteAdvertisementOperation.decorator';

@PUBLIC()
@ApiTags('advertisement')
@Controller('advertisement')
export class AdvertisementController {
    constructor(private readonly advertisementService: AdvertisementService) {}

    @AddAdvertisementOperation()
    @HttpCode(HttpStatus.OK)
    @Post()
    async addAdvertisement(
        @Body() dto: CreateAdvertisementDto,
    ): Promise<TApiResp<TApiAdvertisementResponse>> {
        return this.advertisementService.addAdvertisement(dto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @GetAllAdvertisementsOperation()
    async getAllAdvertisements(): Promise<
        TApiResp<TApiAdvertisementsResponse>
    > {
        return this.advertisementService.getAllAdvertisements();
    }

    @Patch(':advertisementId')
    @HttpCode(HttpStatus.OK)
    @UpdateAdvertisementOperation()
    async updateAdvertisement(
        @Param('advertisementId') advertisementId: string,
        @Body() dto: UpdateAdvertisementDto,
    ): Promise<TApiResp<TApiAdvertisementResponse>> {
        return this.advertisementService.updateAdvertisement(
            advertisementId,
            dto,
        );
    }

    @DeleteAdvertisementOperation()
    @HttpCode(HttpStatus.OK)
    @Delete(':advertisementId')
    async deleteAdvertisement(
        @Param('advertisementId') advertisementId: string,
    ): Promise<TApiResp<true>> {
        return this.advertisementService.deleteAdvertisement(advertisementId);
    }
}
