import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  create(@Body() tokenDto: CreateTokenDto) {
    return this.tokensService.create({
      chainId: tokenDto.chainId,
      address: tokenDto.address,
      symbol: tokenDto.symbol,
      tokenName: tokenDto.tokenName,
      decimals: +tokenDto.decimals,
    });
  }

  @Get()
  async findAll() {
    const tokens = await this.tokensService.findAll();
    return tokens.map((t) => ({
      tokenId: t.tokenId,
      address: t.address,
      symbol: t.symbol,
      tokenName: t.tokenName,
      decimals: t.decimals,
      chainId: t.chain?.chainId,
    }));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() tokenDto: CreateTokenDto) {
    return this.tokensService.update(+id, tokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tokensService.remove(id);
  }
}
