import { CreateReviewDto } from 'src/libs/contracts/dto/review.dto';
import { ReviewService } from './review.service';
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UserTokenDto } from '../token/dto/userToken.dto';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ApiTags } from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';

@ApiTags('review')
@USER()
@Controller('review')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    @Post()
    async createReview(
        @CurrentUser() currentUser: UserTokenDto,
        @Body() dto: CreateReviewDto,
    ) {
        return await this.reviewService.createReview(currentUser.id, dto);
    }

    @Delete(':reviewId')
    async deleteReview(
        @CurrentUser() currentUser: UserTokenDto,
        @Param('reviewId') reviewId: string,
    ) {
        return await this.reviewService.deleteReview(currentUser.id, reviewId);
    }
}
