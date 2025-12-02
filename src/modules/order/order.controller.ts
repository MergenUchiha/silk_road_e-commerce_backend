import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Patch,
    Delete,
    HttpCode,
    ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
    PlaceAnOrderDto,
    UpdateOrderDto,
    TApiOrderResponse,
    TApiOrdersResponse,
} from 'src/libs/contracts';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserTokenDto } from '../token/dto/userToken.dto';
import { USER } from 'src/common/decorators/isUser.decorator';
import { ApiTags } from '@nestjs/swagger';
import { TApiResp } from 'src/libs/contracts/interface';

@USER()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    /**
     * Создать заказ из корзины
     */
    @HttpCode(200)
    @Post()
    async placeAnOrder(
        @CurrentUser() currentUser: UserTokenDto,
        @Body() dto: PlaceAnOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        return await this.orderService.placeAnOrder(currentUser.id, dto);
    }

    /**
     * Получить мои заказы
     */
    @Get('my')
    async getMyOrders(
        @CurrentUser() currentUser: UserTokenDto,
    ): Promise<TApiResp<TApiOrdersResponse>> {
        return await this.orderService.getMyOrders(currentUser.id);
    }

    /**
     * Получить все заказы (админ-логика может быть вынесена в guard)
     */
    @Get()
    async getAllOrders(): Promise<TApiResp<TApiOrdersResponse>> {
        return await this.orderService.getAllOrders();
    }

    /**
     * Получить заказ по ID
     */
    @Get(':orderId')
    async getOrderById(
        @Param('orderId', ParseUUIDPipe) orderId: string,
    ): Promise<TApiResp<TApiOrderResponse>> {
        return await this.orderService.getOrderById(orderId);
    }

    /**
     * Обновить статус заказа
     */
    @Patch(':orderId')
    async updateOrder(
        @Param('orderId', ParseUUIDPipe) orderId: string,
        @Body() dto: UpdateOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        return await this.orderService.updateOrder(orderId, dto);
    }

    /**
     * Отмена заказа пользователем
     */
    @Delete(':orderId')
    async cancelOrder(
        @CurrentUser() currentUser: UserTokenDto,
        @Param('orderId', ParseUUIDPipe) orderId: string,
    ): Promise<TApiResp<true>> {
        return await this.orderService.cancelOrder(orderId, currentUser.id);
    }
}
