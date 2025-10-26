import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { ShopsResponseDto } from 'src/libs/contracts';

export function GetShopsOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({
            summary: 'Get a list of shops',
            description:
                'Returns a paginated list of shops with optional filtering by name.',
        }),
        ApiQuery({ name: 'page', type: Number, required: false, example: 1 }),
        ApiQuery({ name: 'take', type: Number, required: false, example: 5 }),
        ApiQuery({ name: 'q', type: String, required: false, example: 'shop' }),
        ApiResponse({
            status: 200,
            description: 'The list of shops has been successfully retrieved.',
            type: ShopsResponseDto,
        }),
    );
}
