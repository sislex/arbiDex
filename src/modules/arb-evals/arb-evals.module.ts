import { Module } from '@nestjs/common';
import { ArbEvalsController } from './arb-evals.controller';
import { ArbEvalsService } from '../../db/services/arbEvals/arb-evals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArbEvals } from '../../db/entities/ArbEvals';

@Module({
  imports: [TypeOrmModule.forFeature([ArbEvals])],
  controllers: [ArbEvalsController],
  providers: [ArbEvalsService],
  exports: [ArbEvalsService, TypeOrmModule],
})
export class ArbEvalsModule {}
