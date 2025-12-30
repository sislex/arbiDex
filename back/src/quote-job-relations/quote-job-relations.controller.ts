import { Controller, Get, Param} from '@nestjs/common';
import { QuoteJobRelationsService } from './quote-job-relations.service';

@Controller('quote-job-relations')
export class QuoteJobRelationsController {
  constructor(
    private readonly quoteJobRelationsService: QuoteJobRelationsService,
  ) {}

  @Get('by-quote-id/:id')
  async findByQuoteId(@Param('id') id: string) {
    console.log('id:::::::', id);
    return await this.quoteJobRelationsService.findByQuoteId(id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.quoteJobRelationsService.remove(+id);
  // }
}
