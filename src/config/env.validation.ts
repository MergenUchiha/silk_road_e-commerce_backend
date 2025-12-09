import * as z from 'zod';

export const envSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'production']),
    PORT: z.coerce.number(),
    BACKEND_URL: z.string().url(),
    COOKIE_SECRET: z.string(),
    DOMAIN_NAME: z.string().optional(),

    // CORS
    FRONTEND_ORIGINS: z.string().transform((val) => val.split(',')),

    // Database
    DATABASE_URL: z.string().url(),

    // Redis
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string().optional(),

    // MinIO
    // MINIO_ENDPOINT: z.string(),
    // MINIO_USE_SSL: z.coerce.boolean(),
    // MINIO_ROOT_USER: z.string(),
    // MINIO_ROOT_PASSWORD: z.string(),
    // MINIO_BUCKET_NAME: z.string(),

    // JWT for SHOP
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_TIME: z.string(),
    JWT_REFRESH_TIME: z.string(),

    // JWT for ADMIN
    JWT_ADMIN_ACCESS_SECRET: z.string(),
    JWT_ADMIN_REFRESH_SECRET: z.string(),
    JWT_ADMIN_ACCESS_TIME: z.string(),
    JWT_ADMIN_REFRESH_TIME: z.string(),

    // Rate limit
    RATE_LIMIT_TTL: z.coerce.number(),
    RATE_LIMIT_LIMIT: z.coerce.number(),

    // Tokens / verification
    EMAIL_VERIFICATION_TIME: z.coerce.number(),
    TOKEN_REDIS_EXPIRE_TIME: z.coerce.number().optional(),
    VERIFICATION_CODE_EXPIRE: z.coerce.number().optional(),

    // Directus
    DIRECTUS_URL: z.string(),
    DIRECTUS_KEY: z.string().optional(),
    DIRECTUS_SECRET: z.string().optional(),
    DIRECTUS_ADMIN_EMAIL: z.string().email().optional(),
    DIRECTUS_ADMIN_PASSWORD: z.string().optional(),
    DIRECTUS_ADMIN_NAME: z.string().optional(),
    MAX_PAYLOAD_SIZE: z.coerce.number().optional(),

    // Admin defaults
    DEFAULT_ADMIN_USERNAME: z.string(),
    DEFAULT_ADMIN_PASSWORD: z.string(),

    // Health check
    HEALTH_CHECK_TOKEN: z.string(),

    //SWAGGER
    IS_SWAGGER_ENABLED: z.coerce.boolean(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
    const parsed = envSchema.safeParse(config);
    if (parsed.success) return parsed.data;

    const formatted = parsed.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');

    throw new Error(`ENV validation error: ${formatted}`);
}
