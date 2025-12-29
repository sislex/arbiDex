import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PairQuoteRelationsService } from './pair-quote-relations.service';
import { PairQuoteRelationDto } from '../dtos/pair-quote-relations-dto/pair-quote-relation.dto';

@Controller('pair-quote-relations')
export class PairQuoteRelationsController {
  constructor(
    private readonly pairQuoteRelationsService: PairQuoteRelationsService,
  ) {}

  @Post()
  create(@Body() createPairQuoteRelationDto: PairQuoteRelationDto[]) {
    return this.pairQuoteRelationsService.createMany(
      createPairQuoteRelationDto,
    );
  }

  @Get()
  findAll() {
    return this.pairQuoteRelationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pair = await this.pairQuoteRelationsService.findOne(id);
    return {
      pairQuoteRelationId: pair.pairQuoteRelationId,
      pair: pair.pair,
      quote: pair.quote,
    };
  }

  @Get('by-quote-id/:id')
  async findByQuoteId(@Param('id') id: string) {
    return await this.pairQuoteRelationsService.findByQuoteId(id);
  }

  @Delete()
  remove(@Body() id: string[]) {
    return this.pairQuoteRelationsService.remove(id);
  }
}
