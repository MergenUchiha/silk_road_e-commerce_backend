import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ProductResponseSchema } from './product.schema';

export const AddToBasketRequestSchema = z.object({
    quantity: z.string(),
    productId: z.string(),
});

export const BasketItemUpdateRequestSchema = z.object({
    quantity: z.string(),
});

export const BasketItemResponseSchema = z.object({
    id: z.string().uuid(),
    quantity: z.string(),
    product: ProductResponseSchema,
});
export const BasketItemsResponseSchema = z.array(BasketItemResponseSchema);

export const BasketResponseSchema = z.object({
    id: z.string().uuid(),
    totalPrice: z.number().nonnegative(),
    basketItems: BasketItemsResponseSchema,
});

export const BasketsResponseSchema = z.array(BasketResponseSchema);
export type TApiBasketResponse = z.infer<typeof BasketResponseSchema>;
export type TApiBasketsResponse = z.infer<typeof BasketsResponseSchema>;

export class BasketResponseDto extends createZodDto(BasketResponseSchema) {}
export class BasketsResponseDto extends createZodDto(BasketsResponseSchema) {}
