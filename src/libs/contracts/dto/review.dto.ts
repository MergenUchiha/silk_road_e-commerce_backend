import { createZodDto } from 'nestjs-zod';
import { ReviewCreateRequestSchema } from '../schema';

export class CreateReviewDto extends createZodDto(ReviewCreateRequestSchema) {}
