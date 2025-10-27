import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ProductResponseSchema } from './product.schema';

export const ShippingResponseSchema = z.object({
    city: z.string(),
    street: z.string(),
    dateOfDelivery: z.string(),
});

export const PlaceAnOrderRequestSchema = z.object({
    city: z.string(),
    street: z.string(),
    dateOfDelivery: z.string(),
});

export const OrderUpdateRequestSchema = z.object({
    status: z.enum(['PROCESSING', 'COMPLETED', 'CANCELLED']),
});

export const OrderItemResponseSchema = z.object({
    id: z.string().uuid(),
    quantity: z.string(),
    product: ProductResponseSchema,
});
export const OrderItemsResponseSchema = z.array(OrderItemResponseSchema);

export const OrderResponseSchema = z.object({
    id: z.string().uuid(),
    totalPrice: z.number().nonnegative(),
    status: z.enum(['PROCESSING', 'COMPLETED', 'CANCELLED']),
    orderItems: OrderItemsResponseSchema,
    shipping: ShippingResponseSchema,
});

export const OrdersResponseSchema = z.array(OrderResponseSchema);
export type TApiOrderResponse = z.infer<typeof OrderResponseSchema>;
export type TApiOrdersResponse = z.infer<typeof OrdersResponseSchema>;

export class OrderResponseDto extends createZodDto(OrderResponseSchema) {}
export class OrdersResponseDto extends createZodDto(OrdersResponseSchema) {}
