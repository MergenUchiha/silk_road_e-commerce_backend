import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    AddToBasketDto,
    BasketResponseSchema,
    TApiBasketResponse,
    UpdateBasketItemDto,
} from 'src/libs/contracts';
import {
    ProductNotFoundException,
    UserNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BasketService {
    constructor(private prisma: PrismaService) {}

    async addToBasket(
        userId: string,
        dto: AddToBasketDto,
    ): Promise<TApiResp<TApiBasketResponse>> {
        const { productId, quantity } = dto;

        if (!productId || !quantity) {
            throw new BadRequestException(
                'Fields productId and quantity should not be empty!',
            );
        }

        await Promise.all([
            this.findUserById(userId),
            this.findProductById(productId),
        ]);

        try {
            return await this.prisma.$transaction(async (prisma) => {
                const basket = await prisma.basket.upsert({
                    where: { userId },
                    create: { userId },
                    update: {},
                    include: { basketItems: true },
                });

                const existingItem = basket.basketItems.find(
                    (item) => item.productId === productId,
                );

                if (existingItem) {
                    await prisma.basketItems.update({
                        where: { id: existingItem.id },
                        data: { quantity: existingItem.quantity + quantity },
                    });
                } else {
                    await prisma.basketItems.create({
                        data: {
                            basketId: basket.id,
                            productId,
                            quantity,
                        },
                    });
                }

                const basketResponse = await prisma.basket.findUnique({
                    where: { id: basket.id },
                    include: { basketItems: { include: { product: true } } },
                });

                const parsed = BasketResponseSchema.parse(basketResponse);
                return { good: true, response: parsed };
            });
        } catch (error) {
            console.error('Error in addToBasket:', error);
            throw new ConflictException('Failed to add product to basket!');
        }
    }

    async updateBasketItem(
        basketItemId: string,
        dto: UpdateBasketItemDto,
    ): Promise<TApiResp<TApiBasketResponse>> {
        await this.findBasketItemById(basketItemId);
        const basketItem = await this.prisma.basketItems.update({
            where: { id: basketItemId },
            data: {
                quantity: dto.quantity,
            },
        });
        const basket = await this.prisma.basket.findUnique({
            where: { id: basketItem.basketId },
            include: { basketItems: { include: { product: true } } },
        });

        if (!basket) {
            throw new NotFoundException('Basket not found');
        }

        const parsed = BasketResponseSchema.parse(basket);
        return { good: true, response: parsed };
    }

    async deleteBasketItemById(basketItemId: string): Promise<TApiResp<true>> {
        await this.findBasketItemById(basketItemId);
        await this.prisma.basketItems.delete({ where: { id: basketItemId } });
        return { good: true };
    }

    async clearBasket(userId: string): Promise<TApiResp<true>> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { basket: true },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        const basketId = user.basket?.id;
        await this.prisma.basketItems.deleteMany({
            where: { basketId: basketId },
        });
        return { good: true };
    }

    async getMyBasket(userId: string): Promise<TApiResp<TApiBasketResponse>> {
        const basket = await this.prisma.basket.findUnique({
            where: { userId: userId },
            include: { basketItems: { include: { product: true } } },
        });
        if (!basket) throw new NotFoundException('Basket not found');
        const parsed = BasketResponseSchema.parse(basket);

        return { good: true, response: parsed };
    }

    private async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
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

    private async findBasketById(basketId: string) {
        const basket = await this.prisma.basket.findUnique({
            where: { id: basketId },
        });
        if (!basket) {
            throw new NotFoundException('Basket not found');
        }
        return basket;
    }

    private async findBasketItemById(id: string) {
        const basketItem = await this.prisma.basketItems.findUnique({
            where: { id: id },
        });
        if (!basketItem) {
            throw new NotFoundException('Basket item not found');
        }
    }
}
