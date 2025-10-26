import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MediaModule } from 'src/libs/media/media.module';
import { RedisModule } from 'src/libs/redis/redis.module';

@Module({
    imports: [MediaModule, RedisModule],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
