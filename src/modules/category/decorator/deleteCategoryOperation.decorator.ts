import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';

export function DeleteCategoryOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Delete a category',
            description:
                'Deletes a category and all its dependencies (products, images) by its ID.',
        }),
        ApiParam({
            name: 'categoryId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The category has been successfully deleted',
        }),
        ApiResponse({
            status: 404,
            description: 'category not found',
        }),
    );
}
