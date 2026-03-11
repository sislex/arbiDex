import { Module } from '@nestjs/common';
import { GetFeeController } from './get-fee.controller';
import { GetFeeService } from './get-fee.service';

@Module({
  controllers: [GetFeeController],
  providers: [GetFeeService],
})
export class GetFeeModule {}
