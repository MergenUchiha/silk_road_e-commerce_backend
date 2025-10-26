import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { ShopResponseDto } from 'src/libs/contracts';

export function CreateShopOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Create a new shop',
            description:
                'Creates a new shop with the specified name, region, and contacts.',
        }),
        ApiResponse({
            status: 201,
            description: 'The shop has been successfully created.',
            type: ShopResponseDto,
        }),
        ApiResponse({ status: 404, description: 'Region not found' }),
        ApiResponse({
            status: 409,
            description: 'Shop name already exists',
        }),
    );
}
