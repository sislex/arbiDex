import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CexPoolsService } from './cex-pools.service';
import { CexPoolsController } from './cex-pools.controller';
import { CexPool } from '../entities/entities/cex-pool.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CexPool])
  ],
  controllers: [CexPoolsController],
  providers: [CexPoolsService],
  exports: [CexPoolsService],
})
export class CexPoolsModule {}
