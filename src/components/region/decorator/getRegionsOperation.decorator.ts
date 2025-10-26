import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { RegionsResponseDto } from 'src/libs/contracts';

export function GetRegionsOperation() {
    return applyDecorators(
        PUBLIC(),
        ApiOperation({
            summary: 'Get all regions',
        }),
        ApiResponse({ status: 200, type: RegionsResponseDto }),
    );
}
