/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ITransformedFile } from '../interfaces/fileTransform.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductImageTransformer
    implements PipeTransform<Express.Multer.File>
{
    constructor(private configService: ConfigService) {}
    async transform(file: Express.Multer.File): Promise<ITransformedFile> {
        if (!file.path || !file.destination) {
            console.error(
                `File path or destination missing: ${JSON.stringify(file)}`,
            );
            throw new BadRequestException('Image not provided');
        }

        const backendUrl = this.configService.getOrThrow('BACKEND_URL');
        console.log(`File saved to: ${file.path}`);

        return {
            fileName: file.filename,
            originalName: file.originalname,
            filePath: `${backendUrl}/uploads/${file.filename}`, // Относительный путь для базы данных
            mimeType: file.mimetype,
            size: file.size.toString(),
        };
    }
}
