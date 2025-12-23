import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PairQuoteRelationsService } from './pair-quote-relations.service';
import { PairQuoteRelationDto } from '../dtos/pair-quote-relations-dto/pair-quote-relation.dto';

@Controller('pair-quote-relations')
export class PairQuoteRelationsController {
  constructor(
    private readonly pairQuoteRelationsService: PairQuoteRelationsService,
  ) {}

  @Post()
  create(@Body() createPairQuoteRelationDto: PairQuoteRelationDto) {
    return this.pairQuoteRelationsService.create(createPairQuoteRelationDto);
  }

  @Get()
  findAll() {
    return this.pairQuoteRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pairQuoteRelationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePairQuoteRelationDto: PairQuoteRelationDto,
  ) {
    return this.pairQuoteRelationsService.update(
      +id,
      updatePairQuoteRelationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pairQuoteRelationsService.remove(+id);
  }
}
