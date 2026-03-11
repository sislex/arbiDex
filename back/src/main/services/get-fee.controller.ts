import { Controller, Get, Param } from '@nestjs/common';
import { GetFeeService } from './get-fee.service';

@Controller('pool')
export class GetFeeController {
  constructor(private readonly getFeeService: GetFeeService) {}

  @Get('fee/:address')
  getPoolFee(@Param('address') address: string) {
    return this.getFeeService.getPoolFee(address);
  }
}
