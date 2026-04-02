import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CexPairsService } from './cex-pairs.service';
import { CexPairDto } from '../dtos/cex-pools-dto/cex-pool.dto';

@Controller('cex-pairs')
export class CexPairsController {
  constructor(private readonly cexPoolsService: CexPairsService) {}

  @Post()
  create(@Body() createCexPoolDto: CexPairDto) {
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
  update(@Param('id') id: string, @Body() updateCexPoolDto: CexPairDto) {
    return this.cexPoolsService.update(+id, updateCexPoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cexPoolsService.remove(+id);
  }
}
