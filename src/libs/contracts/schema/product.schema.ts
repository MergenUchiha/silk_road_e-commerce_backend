import { z } from 'zod';
import { ImagesResponseSchema } from './image.schema';
import { createZodDto } from 'nestjs-zod';

export const ProductCreateRequestSchema = z.object({
    title: z.string(),
    description: z.string(),
    size: z.string(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
});

export const ProductUpdateRequestSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    size: z.string().optional(),
    price: z.number().positive().optional(),
});

export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    size: z.string(),
    price: z.number().positive(),
    categoryId: z.string().uuid(),
    images: ImagesResponseSchema.optional(),
});

export const ProductsResponseSchema = z.array(ProductResponseSchema);

export type TApiProductResponse = z.infer<typeof ProductResponseSchema>;
export type TApiProductsResponse = z.infer<typeof ProductsResponseSchema>;

export class ProductResponseDto extends createZodDto(ProductResponseSchema) {}
export class ProductsResponseDto extends createZodDto(ProductsResponseSchema) {}
