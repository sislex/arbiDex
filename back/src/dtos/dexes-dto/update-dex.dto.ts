import { PartialType } from '@nestjs/mapped-types';
import { DexDto } from './dex.dto';

export class UpdateDexDto extends PartialType(DexDto) {}
