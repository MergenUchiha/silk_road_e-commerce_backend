import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { MediaModule } from 'src/libs/media/media.module';
import { RedisModule } from 'src/libs/redis/redis.module';

@Module({
    imports: [MediaModule, RedisModule],
    controllers: [ShopController],
    providers: [ShopService],
})
export class ShopModule {}
