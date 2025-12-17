import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '../entities/entities/Tokens';
import { Repository } from 'typeorm';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';
import { Chains } from '../entities/entities/Chains';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepository: Repository<Tokens>,
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
  ) {}

  async create(tokenDto: CreateTokenDto) {
    const chain = await this.chainsRepository.findOne({
      where: { chainId: tokenDto.chainId },
    });
    if (!chain) throw new Error(`Chain с id ${tokenDto.chainId} не найден`);

    const token = this.tokensRepository.create({
      address: tokenDto.address,
      symbol: tokenDto.symbol,
      tokenName: tokenDto.tokenName,
      decimals: tokenDto.decimals,
      chain,
    });

    return await this.tokensRepository.save(token);
  }

  async findAll() {
    return await this.tokensRepository.find({
      relations: ['chain'],
    });
  }

  async update(id: number, tokenDto: CreateTokenDto) {
    const token = await this.tokensRepository.findOne({
      where: { tokenId: id },
      relations: ['chain'],
    });

    if (!token) {
      throw new Error(`Token с id ${id} не найден`);
    }

    const chain = await this.chainsRepository.findOne({
      where: { chainId: tokenDto.chainId },
    });

    if (!chain) {
      throw new Error(`Chain с id ${tokenDto.chainId} не найден`);
    }

    token.address = tokenDto.address;
    token.symbol = tokenDto.symbol;
    token.tokenName = tokenDto.tokenName;
    token.decimals = tokenDto.decimals;
    token.chain = chain;

    return await this.tokensRepository.save(token);
  }

  async remove(id: number) {
    return await this.tokensRepository.delete(id);
  }
}
