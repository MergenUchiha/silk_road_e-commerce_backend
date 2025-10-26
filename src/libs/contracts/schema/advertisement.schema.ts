import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const AdvertisementCreateRequestSchema = z.object({
    expiredDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    productId: z.string().uuid(),
});

export const AdvertisementUpdateRequestSchema = z.object({
    expiredDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .optional(),
});

export const AdvertisementResponseSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    expiredDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    createdDate: z.date().optional(),
});

export const AdvertisementsResponseSchema = z.array(
    AdvertisementResponseSchema,
);

export type TApiAdvertisementResponse = z.infer<
    typeof AdvertisementResponseSchema
>;
export type TApiAdvertisementsResponse = z.infer<
    typeof AdvertisementsResponseSchema
>;

export class AdvertisementResponseDto extends createZodDto(
    AdvertisementResponseSchema,
) {}
export class AdvertisementsResponseDto extends createZodDto(
    AdvertisementsResponseSchema,
) {}
