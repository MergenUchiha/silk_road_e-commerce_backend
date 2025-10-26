import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    PipeTransform,
} from '@nestjs/common';
import { MinioService } from '../../libs/minio/minio.service';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { ITransformedFile } from '../interfaces/fileTransform.interface';

@Injectable()
export class ImageTransformer implements PipeTransform<Express.Multer.File> {
    constructor(private readonly minioService: MinioService) {}

    async transform(
        value:
            | Express.Multer.File
            | Express.Multer.File[]
            | { [key: string]: Express.Multer.File[] },
    ): Promise<
        | ITransformedFile
        | ITransformedFile[]
        | { [key: string]: ITransformedFile }
    > {
        // Handle FileFieldsFastifyInterceptor output (object with image and logo arrays)
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const result: { [key: string]: ITransformedFile } = {};
            for (const [key, files] of Object.entries(value)) {
                if (files && files.length > 0) {
                    console.debug(
                        `Processing ${key} with ${files.length} files`,
                    );
                    result[key] = await this.transformSingle(files[0]); // Take the first file
                } else {
                    console.warn(`No files provided for ${key}`);
                }
            }
            return result;
        }

        // Handle single file or array of files
        if (Array.isArray(value)) {
            return Promise.all(value.map((f) => this.transformSingle(f)));
        }

        if (value) {
            return this.transformSingle(value as Express.Multer.File);
        }

        console.warn('No files provided in request');
        return {}; // Return empty object to allow controller to handle missing files
    }

    private async transformSingle(
        file: Express.Multer.File,
    ): Promise<ITransformedFile> {
        if (!file.path || !file.destination)
            throw new BadRequestException('Image not provided');

        try {
            console.debug(`Processing file: ${file.originalname}`);
            const uploadStream = createReadStream(file.path);
            await this.minioService.uploadFileStream(
                file.filename,
                uploadStream,
                file.size,
                file.mimetype,
            );

            const transformedFile: ITransformedFile = {
                fileName: file.filename,
                originalName: file.originalname,
                filePath: await this.minioService.getFileUrl(file.filename),
                mimeType: file.mimetype,
                size: file.size.toString(),
            };

            await unlink(file.path);
            console.debug(`File processed: ${file.originalname}`);
            return transformedFile;
        } catch {
            console.error(`Error processing file ${file.originalname}:`);
            await unlink(file.path).catch((e) =>
                console.error(`Failed to unlink file: ${e}`),
            );
            throw new InternalServerErrorException(
                `Failed to process file: ${file.originalname}. Please check server logs for details.`,
            );
        }
    }

    // async transformProduct(
    //     file: Express.Multer.File,
    // ): Promise<ITransformedFile> {
    //     let transformedFile: ITransformedFile;
    //     if (!file.path || !file.destination)
    //         throw new BadRequestException('Image not provided');
    //     try {
    //         const uploadStream = createReadStream(file.path);

    //         await this.minioService.uploadFileStream(
    //             file.filename,
    //             uploadStream,
    //             file.size,
    //             file.mimetype,
    //         );

    //         transformedFile = {
    //             fileName: file.filename,
    //             originalName: file.originalname,
    //             filePath: await this.minioService.getFileUrl(file.filename),
    //             mimeType: file.mimetype,
    //             size: file.size.toString(),
    //         };

    //         await unlink(file.path);
    //         return transformedFile;
    //     } catch (err) {
    //         console.error(`Error processing file ${file.originalname}:`, err);
    //         await unlink(file.path);
    //         throw new InternalServerErrorException(
    //             'Failed to process some files. Please check server logs for details.',
    //         );
    //     }
    // }
}
