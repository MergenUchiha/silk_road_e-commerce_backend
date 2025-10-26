import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { AdvertisementResponseDto } from 'src/libs/contracts';

export function UpdateAdvertisementOperation() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Update an existing advertisement' }),
        ApiParam({
            name: 'advertisementId',
            description: 'Advertisement identifier',
            type: String,
        }),
        ApiResponse({
            status: 200,
            description: 'Advertisement successfully updated',
            type: AdvertisementResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Advertisement not found',
        }),
    );
}
