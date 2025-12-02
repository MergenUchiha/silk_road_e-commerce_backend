import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';
import {
    OrderResponseSchema,
    OrdersResponseSchema,
    PlaceAnOrderDto,
    TApiOrderResponse,
    TApiOrdersResponse,
    UpdateOrderDto,
} from 'src/libs/contracts';
import { TApiResp } from 'src/libs/contracts/interface';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

    /**
     * Создать заказ из корзины пользователя
     */
    async placeAnOrder(
        userId: string,
        dto: PlaceAnOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        const { city, street, dateOfDelivery } = dto;

        return this.prisma.$transaction(async (tx) => {
            const basket = await tx.basket.findUnique({
                where: { userId },
                include: {
                    basketItems: {
                        include: { product: true },
                    },
                },
            });

            if (!basket || basket.basketItems.length === 0) {
                throw new BadRequestException('Basket is empty ❗');
            }

            const orderItemsData = basket.basketItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));

            const totalPrice = basket.basketItems.reduce(
                (sum, item) => sum + item.product.price * item.quantity,
                0,
            );

            const order = await tx.order.create({
                data: {
                    userId,
                    status: Status.PROCESSING,
                    totalPrice,
                    orderItems: { create: orderItemsData },
                    shipping: {
                        create: {
                            userId: userId,
                            city,
                            street,
                            dateOfDelivery,
                        },
                    },
                },
                include: {
                    orderItems: { include: { product: true } },
                    shipping: true,
                },
            });

            await tx.basketItems.deleteMany({
                where: { basketId: basket.id },
            });

            const parsed = OrderResponseSchema.parse(order);

            return { good: true, response: parsed };
        });
    }

    /**
     * Обновление статуса заказа (PROCESSING → COMPLETED / CANCELLED)
     */
    async updateOrder(
        orderId: string,
        dto: UpdateOrderDto,
    ): Promise<TApiResp<TApiOrderResponse>> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) throw new NotFoundException('Order not found ❗');

        if (order.status === Status.COMPLETED)
            throw new BadRequestException('Order already completed');

        try {
            const updatedOrder = await this.prisma.order.update({
                where: { id: orderId },
                data: { status: dto.status },
            });
            const parsed = OrderResponseSchema.parse(updatedOrder);
            return { good: true, response: parsed };
        } catch {
            throw new ConflictException('Failed to update order');
        }
    }

    /**
     * Получить заказ по ID
     */
    async getOrderById(orderId: string): Promise<TApiResp<TApiOrderResponse>> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: { product: true },
                },
                shipping: true,
            },
        });

        if (!order) throw new NotFoundException('Order not found ❗');

        const parsed = OrderResponseSchema.parse(order);
        return { good: true, response: parsed };
    }

    /**
     * Заказы текущего пользователя
     */
    async getMyOrders(userId: string): Promise<TApiResp<TApiOrdersResponse>> {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: { include: { product: true } },
                shipping: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        const parsed = OrdersResponseSchema.parse(orders);

        return { good: true, response: parsed };
    }

    /**
     * Все заказы (для администратора)
     */
    async getAllOrders(): Promise<TApiResp<TApiOrdersResponse>> {
        const orders = await this.prisma.order.findMany({
            include: {
                orderItems: { include: { product: true } },
                shipping: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const parsed = OrdersResponseSchema.parse(orders);

        return { good: true, response: parsed };
    }

    /**
     * Отмена заказа
     */
    async cancelOrder(
        orderId: string,
        userId: string,
    ): Promise<TApiResp<true>> {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) throw new NotFoundException('Order not found ❗');

        if (order.userId !== userId)
            throw new ForbiddenException('Not your order ❗');

        if (order.status === Status.CANCELLED) return { good: true };

        if (order.status === Status.COMPLETED)
            throw new BadRequestException('Order already completed');

        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: Status.CANCELLED },
        });
        return { good: true };
    }
}
