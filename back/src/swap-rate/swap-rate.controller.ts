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
  findAll() {
    return this.swapRateService.findAll();
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
