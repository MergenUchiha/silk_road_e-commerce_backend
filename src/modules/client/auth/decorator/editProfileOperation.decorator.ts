import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { UserResponseDto } from 'src/libs/contracts';

export function EditProfileOperation() {
    return applyDecorators(
        USER(),
        ApiOperation({ summary: 'Edit profile operation' }),
        ApiResponse({
            status: 200,
            description: 'User updated',
            type: UserResponseDto,
        }),
        ApiResponse({
            status: 401,
            description: 'User unauthorized',
        }),
        ApiResponse({
            status: 404,
            description: 'User not found',
        }),
    );
}
