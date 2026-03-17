import { PartialType } from '@nestjs/mapped-types';
import { CreateQuotesGraphDto } from './create-quotes_graph.dto';

export class UpdateQuotesGraphDto extends PartialType(CreateQuotesGraphDto) {}
