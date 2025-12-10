import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { generateHash, verifyHash } from 'src/helpers/providers/generateHash';
import { generateVerificationEmailCodeAndExpiry } from 'src/helpers/providers/generateVerificationEmailCodeAndExpiry';
import {
    TApiUserAuthTokenResponse,
    TApiUserResponse,
    UpdateUserDto,
    UserLoginDto,
    UserRegistrationDto,
    UserResponseSchema,
    UserVerificationDto,
} from 'src/libs/contracts';
import {
    UserNotFoundException,
    UserEmailAlreadyExistsException,
    UserWrongPasswordException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { RedisService } from 'src/libs/redis/redis.service';
import { UserTokenDto } from 'src/modules/token/dto/userToken.dto';
import { TokenService } from 'src/modules/token/token.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
        private tokenService: TokenService,
    ) {}

    async userRegistration(
        dto: UserRegistrationDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        await this.isEmailExist(dto.email);
        const hashedPassword = await generateHash(dto.password);
        dto.password = hashedPassword;
        const user = await this.prisma.user.create({ data: dto });
        const { code, expiry } = generateVerificationEmailCodeAndExpiry();
        await this.redis.setWithExpiry(
            'emailVerification',
            `${user.id}:${user.email}`,
            code,
            +expiry,
        );

        const parsed = UserResponseSchema.parse(user);

        return { good: true, response: parsed };
    }

    async userLogin(
        dto: UserLoginDto,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        const user = await this.findUserByEmail(dto.email);
        const isPasswordCorrect = await verifyHash(dto.password, user.password);
        if (!user.isVerified) {
            throw new ForbiddenException('User is not verified');
        }
        if (!isPasswordCorrect) {
            throw new UserWrongPasswordException();
        }
        const tokens = this.tokenService.generateTokens({
            ...new UserTokenDto(user),
        });

        await this.tokenService.saveTokens(user.id, tokens.refreshToken);
        return {
            good: true,
            response: {
                id: user.id,
                email: user.email,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
        };
    }

    async userRefreshToken(
        refreshToken: string,
    ): Promise<TApiResp<TApiUserAuthTokenResponse>> {
        if (!refreshToken) {
            throw new UnauthorizedException('Invalid token!');
        }

        const tokenFromDB = await this.tokenService.findToken(refreshToken);
        const validToken = this.tokenService.validateRefreshToken(refreshToken);

        if (!validToken || !tokenFromDB) {
            throw new UnauthorizedException('Invalid token!');
        }

        const user = await this.findUserById(validToken.id);

        const tokens = this.tokenService.generateTokens({
            ...new UserTokenDto(user),
        });

        await this.tokenService.saveTokens(user.id, tokens.refreshToken);

        return {
            good: true,
            response: { id: user.id, email: user.email, ...tokens },
        };
    }

    async userLogout(refreshToken: string): Promise<TApiResp<true>> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }

        await this.tokenService.deleteToken(refreshToken);

        return { good: true };
    }

    async userVerification(
        userId: string,
        dto: UserVerificationDto,
    ): Promise<TApiResp<true>> {
        const user = await this.findUserById(userId);
        if (user.isVerified) {
            throw new ConflictException('User already has been verified!');
        }
        await this.validateVerificationEmailCode(dto, user.id, user.email);
        await this.prisma.user.update({
            where: { id: userId },
            data: { isVerified: true },
        });
        return { good: true };
    }

    async userResendVerificationCode(userId: string): Promise<TApiResp<true>> {
        const user = await this.findUserById(userId);
        if (user.isVerified) {
            throw new ConflictException('User already has been verified!');
        }
        const { code, expiry } = generateVerificationEmailCodeAndExpiry();
        await this.redis.setWithExpiry(
            'emailVerification',
            `${user.id}:${user.email}`,
            code,
            +expiry,
        );
        return { good: true };
    }

    async getMe(userId: string): Promise<TApiResp<TApiUserResponse>> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        const parsed = UserResponseSchema.parse(user);
        return {
            good: true,
            response: parsed,
        };
    }

    async editProfile(
        userId: string,
        dto: UpdateUserDto,
    ): Promise<TApiResp<TApiUserResponse>> {
        await this.findUserById(userId);
        if (dto.password) {
            dto.password = await generateHash(dto.password);
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: dto,
        });
        const parsed = UserResponseSchema.parse(user);
        return {
            good: true,
            response: parsed,
        };
    }

    private async validateVerificationEmailCode(
        dto: UserVerificationDto,
        userId: string,
        userEmail: string,
    ): Promise<void> {
        const key = `${userId}:${userEmail}`;
        const verificationEmailCode = await this.redis.get(
            'emailVerification',
            key,
        );
        if (verificationEmailCode !== dto.code) {
            throw new BadRequestException('Verification code is wrong');
        }
        await this.redis.delete('emailVerification', key);
    }

    private async findUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }

    private async findUserByEmail(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) throw new UserNotFoundException();
        return user;
    }

    private async isEmailExist(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });
        if (user) {
            throw new UserEmailAlreadyExistsException();
        }
    }
}
