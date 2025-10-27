import { createZodDto } from 'nestjs-zod';
import { PlaceAnOrderRequestSchema, OrderUpdateRequestSchema } from '../schema';

export class PlaceAnOrderDto extends createZodDto(PlaceAnOrderRequestSchema) {}

export class UpdateOrderDto extends createZodDto(OrderUpdateRequestSchema) {}
