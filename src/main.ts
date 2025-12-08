/* eslint-disable @typescript-eslint/no-unsafe-call */
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import 'reflect-metadata';
import { AppModule } from './app.module';
import './instrument';
import { LoggerService } from './utils/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { promises as fs } from 'fs';

async function bootstrap() {
    patchNestJsSwagger();

    // === 1. Ensure uploads folder exists ===
    const uploadDir = join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            bufferLogs: true,
        },
    );

    const logger = app.get(LoggerService);
    app.useLogger(logger);

    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>('PORT');
    const environment = configService.getOrThrow<string>('ENVIRONMENT');
    const allowedOrigins = '*';

    // === 2. Swagger ===
    if (configService.getOrThrow<boolean>('IS_SWAGGER_ENABLED')) {
        const config = new DocumentBuilder()
            .setTitle('Silk Road API')
            .setDescription('API документация для Silk Road')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
    }

    // === 3. Security & Base middlewares ===
    await app.register(fastifyHelmet);
    await app.register(fastifyCors, {
        credentials: true,
        origin: allowedOrigins,
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposedHeaders: ['Set-Cookie'],
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    });

    await app.register(multipart);
    await app.register(fastifyCookie, {
        secret: configService.getOrThrow<string>('COOKIE_SECRET'),
    });

    // === 4. GLOBAL settings ===
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    if (environment === 'development') {
        app.setGlobalPrefix('api');
    }

    // === 5. STATIC FILES: fix 404 for uploads ===
    await app.register(fastifyStatic, {
        root: uploadDir,
        prefix: '/uploads/', // <-- URL prefix
        decorateReply: false,
    });
    app.getHttpAdapter()
        .getInstance()
        .addHook('onSend', (request, reply, payload, done) => {
            if (request.raw.url?.startsWith('/uploads/')) {
                reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
                reply.header('Access-Control-Allow-Origin', '*');
            }
            done();
        });

    // === 6. Start server ===
    await app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Static files available at /uploads`);
    });
}

bootstrap();
