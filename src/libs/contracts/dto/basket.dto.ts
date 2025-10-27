import { createZodDto } from 'nestjs-zod';
import {
    AddToBasketRequestSchema,
    BasketItemUpdateRequestSchema,
} from '../schema';

export class AddToBasketDto extends createZodDto(AddToBasketRequestSchema) {}

export class UpdateBasketItemDto extends createZodDto(
    BasketItemUpdateRequestSchema,
) {}
