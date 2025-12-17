import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketDto } from '../dtos/markets-dto/market.dto';

@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}
  @Post()
  create(@Body() marketDto: MarketDto) {
    return this.marketsService.create(marketDto);
  }

  @Get()
  async findAll() {
    const markets = await this.marketsService.findAll();
    return markets.map((m) => ({
      poolId: m.pool.poolId,
      amount: m.amount,
      marketId: m.marketId,
    }));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() marketDto: MarketDto) {
    return '123';
    // return this.marketsService.update(+id, marketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketsService.remove(+id);
  }
}
