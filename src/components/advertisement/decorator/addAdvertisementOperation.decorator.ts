import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdvertisementResponseDto } from 'src/libs/contracts';

export function AddAdvertisementOperation() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Create a new advertisement' }),
        ApiResponse({
            status: 200,
            description: 'Advertisement successfully created',
            type: AdvertisementResponseDto,
        }),
        ApiResponse({
            status: 400,
            description:
                'Advertisement for the specified product already exists',
        }),
        ApiResponse({
            status: 404,
            description: 'Product not found',
        }),
    );
}
