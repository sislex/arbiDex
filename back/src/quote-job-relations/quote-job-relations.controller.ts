import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { QuoteJobRelationsService } from './quote-job-relations.service';
import { QuoteJobRelationDto } from '../dtos/quote-job-relations-dto/quote-job-relation.dto';

@Controller('quote-job-relations-dto')
export class QuoteJobRelationsController {
  constructor(
    private readonly quoteJobRelationsService: QuoteJobRelationsService,
  ) {}

  @Post()
  create(@Body() createQuoteJobRelationDto: QuoteJobRelationDto) {
    return this.quoteJobRelationsService.create(createQuoteJobRelationDto);
  }

  @Get()
  findAll() {
    return this.quoteJobRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quoteJobRelationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuoteJobRelationDto: QuoteJobRelationDto,
  ) {
    return this.quoteJobRelationsService.update(+id, updateQuoteJobRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quoteJobRelationsService.remove(+id);
  }
}
