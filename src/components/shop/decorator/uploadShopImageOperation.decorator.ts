import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import {
    diskStorage,
    FileFieldsFastifyInterceptor,
} from 'fastify-file-interceptor';
import { imageFilter } from 'src/common/filters/imageFilter';
import { randomUUID } from 'crypto';
import { USER } from 'src/common/decorators/isUser.decorator';

export function UploadShopImageOperation() {
    return applyDecorators(
        USER(),
        ApiBearerAuth(),
        ApiOperation({
            summary: 'Upload media files for a shop (image and logo)',
        }),
        ApiResponse({
            status: 200,
            description: 'Shop image and logo uploaded',
        }),
        ApiResponse({ status: 404, description: 'Shop not found' }),
        ApiConsumes('multipart/form-data'),
        UseInterceptors(
            FileFieldsFastifyInterceptor(
                [
                    { name: 'image', maxCount: 1 },
                    { name: 'logo', maxCount: 1 },
                ],
                {
                    storage: diskStorage({
                        destination: './temp',
                        filename: (req, file, cb) => {
                            const fileExtension = file.mimetype.split('/')[1];
                            const uniqueFileName = `${randomUUID()}.${fileExtension}`;
                            cb(null, uniqueFileName);
                        },
                    }),
                    limits: { fileSize: 1024 * 1024 * 1500 },
                    fileFilter: imageFilter,
                },
            ),
        ),
    );
}
