import { Module } from '@nestjs/common';
import { PairsService } from './pairs.service';
import { PairsController } from './pairs.controller';

@Module({
  controllers: [PairsController],
  providers: [PairsService],
})
export class PairsModule {}
