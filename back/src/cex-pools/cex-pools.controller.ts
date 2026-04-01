import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CexPoolsService } from './cex-pools.service';
import { CexPoolDto } from '../dtos/cex-pools-dto/cex-pool.dto';

@Controller('cex-pools')
export class CexPoolsController {
  constructor(private readonly cexPoolsService: CexPoolsService) {}

  @Post()
  create(@Body() createCexPoolDto: CexPoolDto) {
    return this.cexPoolsService.create(createCexPoolDto);
  }

  @Get()
  findAll() {
    return this.cexPoolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cexPoolsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCexPoolDto: CexPoolDto) {
    return this.cexPoolsService.update(+id, updateCexPoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cexPoolsService.remove(+id);
  }
}
