import { Module } from '@nestjs/common';
import { ChainsService } from './chains.service';
import { ChainsController } from './chains.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from '../entities/entities/Tokens';
import { Chains } from '../entities/entities/Chains';

@Module({
  imports: [TypeOrmModule.forFeature([Tokens, Chains])],
  controllers: [ChainsController],
  providers: [ChainsService],
  exports: [ChainsService],
})
export class ChainsModule {}
