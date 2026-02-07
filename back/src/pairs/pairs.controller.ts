import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PairsService } from './pairs.service';
import { PairDto } from '../dtos/pairs-dto/pair.dto';

@Controller('pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Post()
  create(@Body() createPairDto: PairDto) {
    return this.pairsService.create(createPairDto);
  }

  @Get()
  async findAll() {
    const pairs = await this.pairsService.findAll();
    return pairs.map(pair => this.toDto(pair));
  }
  private toDto(pair: any) {
    return {
      pairId: pair.pairId,
      poolId: pair.pool.poolId,
      tokenInId: pair.tokenIn.tokenId,
      tokenOutId: pair.tokenOut.tokenId,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pairsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePairDto: PairDto) {
    return this.pairsService.update(+id, updatePairDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pairsService.remove(+id);
  }
}
