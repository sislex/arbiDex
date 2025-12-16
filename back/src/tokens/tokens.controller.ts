import { Controller, Get, Post, Body } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  create(@Body() tokenDto: CreateTokenDto) {
    return this.tokensService.create({
      chain: { chainId: tokenDto.chainId },
      address: tokenDto.address,
    });
  }

  @Get()
  async findAll() {
    return await this.tokensService.findAll();
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tokensService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
  //   return this.tokensService.update(+id, updateTokenDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tokensService.remove(+id);
  // }
}
