import * as z from 'zod';

export const envSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'production']),
    PORT: z.coerce.number(),
    BACKEND_URL: z.string().url(),
    COOKIE_SECRET: z.string(),
    DOMAIN_NAME: z.string().optional(),

    // Database
    DATABASE_URL: z.string().url(),

    // Redis
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_PASSWORD: z.string().optional(),

    // MinIO
    MINIO_ENDPOINT: z.string(),
    MINIO_USE_SSL: z.coerce.boolean(),
    MINIO_ROOT_USER: z.string(),
    MINIO_ROOT_PASSWORD: z.string(),
    MINIO_BUCKET_NAME: z.string(),

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
    TOKEN_REDIS_EXPIRE_TIME: z.coerce.number(),
    VERIFICATION_CODE_EXPIRE: z.coerce.number(),

    // Directus
    DIRECTUS_URL: z.string(),
    DIRECTUS_KEY: z.string(),
    DIRECTUS_SECRET: z.string(),
    DIRECTUS_ADMIN_EMAIL: z.string().email(),
    DIRECTUS_ADMIN_PASSWORD: z.string(),
    DIRECTUS_ADMIN_NAME: z.string(),
    MAX_PAYLOAD_SIZE: z.coerce.number(),

    // Health check
    HEALTH_CHECK_TOKEN: z.string(),

    // Logging config (JSON arrays)
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

function parseJsonArray(v: string): string[] {
    let str = v.trim();
    if (
        (str.startsWith("'") && str.endsWith("'")) ||
        (str.startsWith('"') && str.endsWith('"'))
    ) {
        str = str.slice(1, -1);
    }
    try {
        return JSON.parse(str) as string[];
    } catch {
        throw new Error('Must be a valid JSON array string');
    }
}
