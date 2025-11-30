import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { UserResponseSchema } from './user.schema';

export const ReviewCreateRequestSchema = z.object({
    productId: z.string().uuid(),
    comment: z.string(),
    rating: z.number(),
});

export const ReviewResponseSchema = z.object({
    id: z.string().uuid(),
    comment: z.string(),
    rating: z.number(),
    user: UserResponseSchema.optional(),
});

export const ReviewsResponseSchema = z.array(ReviewResponseSchema);
export type TApiReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type ReviewsResponse = z.infer<typeof ReviewsResponseSchema>;

export class ReviewResponseDto extends createZodDto(ReviewResponseSchema) {}
export class ReviewsResponseDto extends createZodDto(ReviewsResponseSchema) {}
