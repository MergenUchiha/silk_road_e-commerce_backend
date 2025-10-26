import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';

export function DeleteProductImageOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'Delete category media files' }),
        ApiResponse({
            status: 200,
            description: 'Product image deleted',
        }),
        ApiResponse({ status: 404, description: 'Product not found' }),
    );
}
