import { PartialType } from '@nestjs/mapped-types';
import { TokenDto } from './token.dto';

export class UpdateTokenDto extends PartialType(TokenDto) {}
