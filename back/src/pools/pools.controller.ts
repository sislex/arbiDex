import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolDto } from '../dtos/pools-dto/pool.dto';

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Post()
  create(@Body() createPoolDto: PoolDto) {
    return this.poolsService.create(createPoolDto);
  }

  @Get()
  async findAll() {
    const pools = await this.poolsService.findAll();
    return pools.map((p) => ({
      poolId: p.poolId,
      chain: p.chain,
      token: p.token,
      token2: p.token2,
      dex: p.dex,
      version: p.version,
      fee: p.fee,
      poolAddress: p.poolAddress,
    }));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePoolDto: PoolDto) {
    return this.poolsService.update(+id, updatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolsService.remove(+id);
  }
}
