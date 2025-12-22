import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MarketJobRelationsService } from './market-job-relations.service';
import { MarketJobRelationsDto } from '../dtos/market-job-relations-dto/market-job-relations.dto';

@Controller('market-job-relations')
export class MarketJobRelationsController {
  constructor(
    private readonly marketJobRelationsService: MarketJobRelationsService,
  ) {}

  @Post()
  create(@Body() createMarketJobRelationDto: MarketJobRelationsDto) {
    return this.marketJobRelationsService.create(createMarketJobRelationDto);
  }

  @Get()
  findAll() {
    return this.marketJobRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketJobRelationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMarketJobRelationDto: MarketJobRelationsDto,
  ) {
    return this.marketJobRelationsService.update(
      +id,
      updateMarketJobRelationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketJobRelationsService.remove(+id);
  }
}
