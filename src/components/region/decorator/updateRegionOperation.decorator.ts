import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { RegionResponseDto } from 'src/libs/contracts';

export function UpdateRegionOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Update region',
            description: 'Updates region',
        }),
        ApiResponse({ status: 200, type: RegionResponseDto }),
        ApiResponse({ status: 404, description: 'Region not found' }),
        ApiResponse({ status: 409, description: 'Region already exists' }),
    );
}
