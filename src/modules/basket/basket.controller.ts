import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import {
    AddToBasketDto,
    TApiBasketResponse,
    UpdateBasketItemDto,
} from 'src/libs/contracts';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserTokenDto } from '../token/dto/userToken.dto';
import { USER } from 'src/common/decorators/isUser.decorator';
import { ApiTags } from '@nestjs/swagger';
import { TApiResp } from 'src/libs/contracts/interface';

@USER()
@ApiTags('basket')
@Controller('basket')
export class BasketController {
    constructor(private basketService: BasketService) {}

    @HttpCode(200)
    @Post()
    async addToBasket(
        @CurrentUser() currentUser: UserTokenDto,
        @Body() dto: AddToBasketDto,
    ): Promise<TApiResp<TApiBasketResponse>> {
        return await this.basketService.addToBasket(currentUser.id, dto);
    }

    @Patch(':basketItemId')
    async updateBasketItem(
        @Param('basketItemId', ParseUUIDPipe) basketItemId: string,
        @Body() dto: UpdateBasketItemDto,
    ): Promise<TApiResp<TApiBasketResponse>> {
        return this.basketService.updateBasketItem(basketItemId, dto);
    }

    @Delete(':basketItemId')
    async deleteBasketItemById(
        @Param('basketItemId', ParseUUIDPipe) basketItemId: string,
    ): Promise<TApiResp<true>> {
        return this.basketService.deleteBasketItemById(basketItemId);
    }

    @Delete()
    async clearBasket(
        @CurrentUser() currentUser: UserTokenDto,
    ): Promise<TApiResp<true>> {
        return this.basketService.clearBasket(currentUser.id);
    }

    @Get('my')
    async getMyBasket(
        @CurrentUser() currentUser: UserTokenDto,
    ): Promise<TApiResp<TApiBasketResponse>> {
        return await this.basketService.getMyBasket(currentUser.id);
    }
}
