import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';

export function DeleteProductImageOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({ summary: 'Delete category media files' }),
        ApiResponse({
            status: 200,
            description: 'Product image deleted',
        }),
        ApiResponse({ status: 404, description: 'Product not found' }),
    );
}
