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
    return await this.poolsService.findAll();
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
