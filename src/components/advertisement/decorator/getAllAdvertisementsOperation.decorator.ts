import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdvertisementsResponseDto } from 'src/libs/contracts';

export function GetAllAdvertisementsOperation() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Retrieve a list of all advertisements' }),
        ApiResponse({
            status: 200,
            description: 'List of advertisements successfully retrieved',
            type: AdvertisementsResponseDto,
        }),
    );
}
