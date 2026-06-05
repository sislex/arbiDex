import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CexPairsService } from './cex-pairs.service';
import { CexPairDto } from '../dtos/cex-pairs-dto/cex-pair.dto';
import { BulkDeleteCexPairsDto } from '../dtos/cex-pairs-dto/bulk-delete-cex-pairs.dto';

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

  @Post('bulk-delete')
  removeMany(@Body() body: BulkDeleteCexPairsDto) {
    return this.cexPoolsService.removeMany(body.ids ?? []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cexPoolsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCexPoolDto: CexPairDto) {
    return this.cexPoolsService.update(+id, updateCexPoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cexPoolsService.remove(+id);
  }
}
