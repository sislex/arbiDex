import { PartialType } from '@nestjs/mapped-types';
import { MarketDto } from './market.dto';

export class UpdateMarketDto extends PartialType(MarketDto) {}
