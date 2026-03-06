import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SwapRateService } from './swap-rate.service';
import { CreateSwapRateDto } from '../dtos/swap-rate/create-swap-rate.dto';
import { UpdateSwapRateDto } from '../dtos/swap-rate/update-swap-rate.dto';

@Controller('swap-rate')
export class SwapRateController {
  constructor(private readonly swapRateService: SwapRateService) {}

  @Post()
  create(@Body() createSwapRateDto: CreateSwapRateDto) {
    return this.swapRateService.create(createSwapRateDto);
  }

  @Get()
  async findAll() {
    const rates = await this.swapRateService.findAll();

    return rates.map(rate => ({
      swapRateId: rate.swapRateId,
      swapRateCount: rate.swapRateCount,
      swapRate0: rate.swapRate0?.tokenId,
      swapRate1: rate.swapRate1?.tokenId,
    }));
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.swapRateService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSwapRateDto: UpdateSwapRateDto) {
    return this.swapRateService.update(+id, updateSwapRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.swapRateService.remove(+id);
  }
}
