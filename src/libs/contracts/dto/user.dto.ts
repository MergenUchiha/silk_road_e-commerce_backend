import { createZodDto } from 'nestjs-zod';
import {
    UserLoginRequestSchema,
    UserRegistrationRequestSchema,
    UserUpdateRequestSchema,
    UserVerificationRequestSchema,
} from '../schema/user.schema';

export class UserRegistrationDto extends createZodDto(
    UserRegistrationRequestSchema,
) {}

export class UserLoginDto extends createZodDto(UserLoginRequestSchema) {}
export class UserVerificationDto extends createZodDto(
    UserVerificationRequestSchema,
) {}

export class UpdateUserDto extends createZodDto(UserUpdateRequestSchema) {}
