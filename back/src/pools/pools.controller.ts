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
import { PoolDto, UpdatePoolDto, UpdateReservesDto } from '../dtos/pools-dto/pool.dto';

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

    return pools.map(pool => ({
      poolId: pool.poolId,
      poolAddress: pool.poolAddress,
      reserve0: pool.reserve0,
      reserve1: pool.reserve1,
      version: pool.version,
      fee: pool.fee,
      chainId: pool.chain?.chainId,
      dexId: pool.dex?.dexId,
      token0Id: pool.token0?.tokenId,
      token1Id: pool.token1?.tokenId,
    }));
  }

  @Put('by-id/:id')
  update(@Param('id') id: string, @Body() updatePoolDto: UpdatePoolDto) {
    return this.poolsService.update(+id, updatePoolDto);
  }

  @Put('update-reserves')
  updateReserves(@Body() dto: UpdateReservesDto[]) {
    return this.poolsService.updateReserves(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolsService.remove(+id);
  }
}
