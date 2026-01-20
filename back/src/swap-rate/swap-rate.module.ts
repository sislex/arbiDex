import { Module } from '@nestjs/common';
import { SwapRateService } from './swap-rate.service';
import { SwapRateController } from './swap-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwapRate } from '../entities/entities/SwapRate';

@Module({
  imports: [TypeOrmModule.forFeature([SwapRate])],
  controllers: [SwapRateController],
  providers: [SwapRateService],
  exports: [SwapRateService],
})
export class SwapRateModule {}
