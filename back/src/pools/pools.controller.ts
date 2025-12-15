import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolDto } from '../dtos/pools-dto/pool.dto';
import { UpdatePoolDto } from '../dtos/pools-dto/update-pool.dto';

@Controller('pools')
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  @Post()
  create(@Body() createPoolDto: PoolDto) {
    return this.poolsService.create(createPoolDto);
  }

  @Get()
  findAll() {
    return this.poolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poolsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoolDto: UpdatePoolDto) {
    return this.poolsService.update(+id, updatePoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poolsService.remove(+id);
  }
}
