import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuoteJobRelationsService } from './quote-job-relations.service';
import { QuoteJobRelationDto } from '../dtos/quote-job-relations-dto/quote-job-relation.dto';

@Controller('quote-job-relations')
export class QuoteJobRelationsController {
  constructor(
    private readonly quoteJobRelationsService: QuoteJobRelationsService,
  ) {}

  @Post()
  create(@Body() createQuoteJobRelationDto: QuoteJobRelationDto[]) {
    return this.quoteJobRelationsService.createMany(createQuoteJobRelationDto);
  }

  @Get('by-quote-id/:id')
  async findByQuoteId(@Param('id') id: string) {
    console.log('id:::::::', id);
    return await this.quoteJobRelationsService.findByQuoteId(id);
  }

  @Delete()
  remove(@Body() id: string[] | number[]) {
    return this.quoteJobRelationsService.remove(id);
  }
}
