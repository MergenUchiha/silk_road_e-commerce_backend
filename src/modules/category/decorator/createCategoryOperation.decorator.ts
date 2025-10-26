import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ADMIN } from 'src/common/decorators/isAdmin.decorator';
import { CategoryResponseDto } from 'src/libs/contracts';

export function CreateCategoryOperation() {
    return applyDecorators(
        ADMIN(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Create a new category',
            description: 'Creates a new category with the specified title.',
        }),
        ApiResponse({
            status: 201,
            description: 'The category has been successfully created.',
            type: CategoryResponseDto,
        }),
        ApiResponse({
            status: 409,
            description: 'Category name already exists',
        }),
    );
}
