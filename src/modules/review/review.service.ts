import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TApiUserResponse } from 'src/libs/contracts';
import { CreateReviewDto } from 'src/libs/contracts/dto/review.dto';
import {
    ProductNotFoundException,
    UserNotFoundException,
} from 'src/libs/contracts/exceptions';
import { TApiResp } from 'src/libs/contracts/interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
    constructor(private prisma: PrismaService) {}

    async createReview(
        userId: string,
        dto: CreateReviewDto,
    ): Promise<TApiResp<true>> {
        await this.findProductById(dto.productId);
        await this.findUserById(userId);
        await this.prisma.review.create({
            data: {
                userId: userId,
                ...dto,
            },
        });
        return { good: true };
    }

    async deleteReview(
        userId: string,
        reviewId: string,
    ): Promise<TApiResp<true>> {
        await this.findUserById(userId);
        await this.findReviewById(reviewId);
        try {
            await this.prisma.review.delete({
                where: { id: reviewId, userId: userId },
            });
        } catch {
            throw new ConflictException(
                'Something went wrong,please try again',
            );
        }
        return {
            good: true,
        };
    }

    private async findReviewById(reviewId: string) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new NotFoundException('Review not found');
        }
    }

    private async findUserById(userId: string): Promise<TApiUserResponse> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }
    private async findProductById(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new ProductNotFoundException();
        }
    }
}
