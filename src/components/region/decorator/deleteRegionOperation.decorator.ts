import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';

export function DeleteRegionOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Delete region',
            description: 'Deletes region',
        }),
        ApiResponse({ status: 200, description: 'Region deleted' }),
        ApiResponse({ status: 404, description: 'Region not found' }),
    );
}
