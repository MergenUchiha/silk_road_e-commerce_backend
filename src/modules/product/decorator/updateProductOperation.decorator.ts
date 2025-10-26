import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { ProductResponseDto } from 'src/libs/contracts';

export function UpdateProductOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Update a product',
            description: 'Updates the details of a specific product by its ID.',
        }),
        ApiParam({
            name: 'productId',
            type: String,
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
        }),
        ApiResponse({
            status: 200,
            description: 'The Product has been successfully updated.',
            type: ProductResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: 'Product not found',
        }),
    );
}
