import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ChainsService } from './chains.service';
import { ChainDto, UpdateChainDto } from '../dtos/chains-dto/chain.dto';

@Controller('chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) {}

  @Post()
  create(@Body() createChainDto: ChainDto) {
    return this.chainsService.create(createChainDto);
  }

  @Get()
  findAll() {
    return this.chainsService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChainDto: UpdateChainDto) {
    return this.chainsService.update(+id, updateChainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chainsService.remove(+id);
  }
}
