import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { RegionResponseDto } from 'src/libs/contracts';

export function CreateRegionOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Create a new region',
            description: 'Creates a new region',
        }),
        ApiResponse({ status: 201, type: RegionResponseDto }),
        ApiResponse({ status: 409, description: 'Region already exists' }),
    );
}
