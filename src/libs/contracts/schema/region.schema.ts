import { z } from 'zod';
import { ShopResponseSchema } from './shop.schema';
import { createZodDto } from 'nestjs-zod';

export const RegionCreateRequestSchema = z.object({
    name: z.string(),
});

export const RegionUpdateRequestSchema = z.object({
    name: z.string(),
});

export const RegionResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    shops: ShopResponseSchema.optional(),
});

export const RegionsResponseSchema = z.array(RegionResponseSchema);

export type TApiRegionResponse = z.infer<typeof RegionResponseSchema>;
export type TApiRegionsResponse = z.infer<typeof RegionsResponseSchema>;

export class RegionResponseDto extends createZodDto(RegionResponseSchema) {}
export class RegionsResponseDto extends createZodDto(RegionsResponseSchema) {}
