import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserRegistrationRequestSchema = z.object({
    email: z.string().email({
        message:
            'Email должен быть в правильном формате, например, user@example.com',
    }),
    password: z
        .string()
        .min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
});

export const UserUpdateRequestSchema = z.object({
    firstName: z.string().optional(),
    secondName: z.string().optional(),
    password: z
        .string()
        .min(8, { message: 'Пароль должен содержать минимум 8 символов' })
        .optional(),
});

export const UserVerificationRequestSchema = z.object({
    code: z
        .string()
        .min(6, { message: 'Код должен содержать минимум 6 символов' }),
});

export const UserLoginRequestSchema = z.object({
    email: z.string().email({
        message:
            'Email должен быть в правильном формате, например, user@example.com',
    }),
    password: z
        .string()
        .min(8, { message: 'Пароль должен содержать минимум 8 символов' }),
});

export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string().optional().nullable(),
    secondName: z.string().optional().nullable(),
    email: z.string(),
});

export const UserTokenResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string(),
    firstName: z.string().optional(),
    secondName: z.string().optional(),
    refreshToken: z.string().jwt(),
    accessToken: z.string().jwt(),
});

export type TApiUserResponse = z.infer<typeof UserResponseSchema>;

export class TApiUserAuthTokenResponse extends createZodDto(
    UserTokenResponseSchema.pick({
        id: true,
        email: true,
        refreshToken: true,
        accessToken: true,
    }),
) {}

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
export class UserAuthTokenResponseDto extends createZodDto(
    UserTokenResponseSchema,
) {}
