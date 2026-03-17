import { Controller, Get, Param } from '@nestjs/common';
import { QuotesGraphService } from './quotes_graph.service';

@Controller('quotes-graph')
export class QuotesGraphController {
  constructor(private readonly quotesGraphService: QuotesGraphService) {}


  @Get()
  findAll() {
    return this.quotesGraphService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.quotesGraphService.findOne(+id);
  }
}
