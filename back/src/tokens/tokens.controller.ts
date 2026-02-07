import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  async findAll() {
    const tokens = await this.tokensService.findAll();
    return tokens.map(token => this.toDto(token));
  }

  private toDto(token: any) {
    return {
      tokenId: token.tokenId,
      address: token.address,
      symbol: token.symbol,
      tokenName: token.tokenName,
      decimals: token.decimals,
      chainId: token.chain.chainId,
    };
  }

  @Get('get-one-token-by-address')
  async findOne(@Query('tokenAddress') tokenAddress: string) {
    return this.tokensService.findOneByAddress(tokenAddress);
  }


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

  @Put(':id')
  update(@Param('id') id: string, @Body() tokenDto: CreateTokenDto) {
    return this.tokensService.update(+id, tokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tokensService.remove(id);
  }
}
