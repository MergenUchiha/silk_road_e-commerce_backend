import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { ProductResponseDto } from 'src/libs/contracts';

export function CreateProductOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Create a new product',
            description:
                'Creates a new product with the specified name, region, and contacts.',
        }),
        ApiResponse({
            status: 201,
            description: 'The product has been successfully created.',
            type: ProductResponseDto,
        }),
    );
}
