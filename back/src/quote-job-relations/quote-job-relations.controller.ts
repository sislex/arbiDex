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

  @Get('by-job-id/:id')
  async findByQuoteId(@Param('id') id: string) {
    return await this.quoteJobRelationsService.findByJobId(id);
  }

  @Delete()
  remove(@Body() id: string[] | number[]) {
    return this.quoteJobRelationsService.remove(id);
  }
}
