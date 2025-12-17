import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DexesService } from './dexes.service';
import { DexDto } from '../dtos/dexes-dto/dex.dto';
import { UpdateDexDto } from '../dtos/dexes-dto/update-dex.dto';

@Controller('dexes')
export class DexesController {
  constructor(private readonly dexesService: DexesService) {}

  @Post()
  create(@Body() createDexDto: DexDto) {
    return this.dexesService.create(createDexDto);
  }

  @Get()
  findAll() {
    return this.dexesService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDexDto: UpdateDexDto) {
    return this.dexesService.update(+id, updateDexDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dexesService.remove(+id);
  }
}
