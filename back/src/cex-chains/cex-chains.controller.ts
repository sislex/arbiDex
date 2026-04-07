import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CexChainsService } from './cex-chains.service';
import { CexChainDto } from '../dtos/cex-chains-dto/cex-chain.dto';

@Controller('cex-chains')
export class CexChainsController {
  constructor(private readonly cexChainsService: CexChainsService) {}

  @Post()
  create(@Body() createCexChainDto: CexChainDto) {
    return this.cexChainsService.create(createCexChainDto);
  }

  @Get()
  findAll() {
    return this.cexChainsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cexChainsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCexChainDto: CexChainDto) {
    return this.cexChainsService.update(+id, updateCexChainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cexChainsService.remove(+id);
  }
}
