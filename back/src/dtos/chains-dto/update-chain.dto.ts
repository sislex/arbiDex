import { PartialType } from '@nestjs/mapped-types';
import { ChainDto } from './chain.dto';

export class UpdateChainDto extends PartialType(ChainDto) {}
