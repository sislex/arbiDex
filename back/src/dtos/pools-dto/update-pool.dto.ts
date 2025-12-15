import { PartialType } from '@nestjs/mapped-types';
import { PoolDto } from './pool.dto';

export class UpdatePoolDto extends PartialType(PoolDto) {}
