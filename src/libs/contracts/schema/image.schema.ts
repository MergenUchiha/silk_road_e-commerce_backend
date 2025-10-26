import { z } from 'zod';
export const ImageCreateRequestSchema = z.object({
    originalName: z.string(),
    fileName: z.string(),
    filePath: z.string(),
    mimeType: z.string(),
    size: z.string(),
    productId: z.string().optional(),
});

export const ImageResponseSchema = z.object({
    id: z.string().uuid(),
    originalName: z.string(),
    fileName: z.string(),
    filePath: z.string(),
    mimeType: z.string(),
    size: z.string(),
    logo: z.boolean(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    productId: z.string().nullable().optional(),
});
export const ImagesResponseSchema = z.array(ImageResponseSchema);
