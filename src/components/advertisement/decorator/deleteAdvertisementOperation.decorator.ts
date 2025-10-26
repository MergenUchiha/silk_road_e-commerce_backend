import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';

export function DeleteAdvertisementOperation() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Delete an advertisement' }),
        ApiParam({
            name: 'advertisementId',
            description: 'Advertisement identifier',
            type: String,
        }),
        ApiResponse({
            status: 200,
            description: 'Advertisement successfully deleted',
        }),
        ApiResponse({
            status: 404,
            description: 'Advertisement not found',
        }),
    );
}
