import { createZodDto } from 'nestjs-zod';
import {
    AdvertisementCreateRequestSchema,
    AdvertisementUpdateRequestSchema,
} from '../schema';

export class CreateAdvertisementDto extends createZodDto(
    AdvertisementCreateRequestSchema,
) {}

export class UpdateAdvertisementDto extends createZodDto(
    AdvertisementUpdateRequestSchema,
) {}
