import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '../entities/entities/Tokens';
import { Repository } from 'typeorm';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';
import { Chains } from '../entities/entities/Chains';
import { ChainsService } from '../chains/chains.service';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepository: Repository<Tokens>,
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
    private chainService: ChainsService,
  ) {}

  async create(tokenDto: CreateTokenDto) {
    const existingToken = await this.tokensRepository.findOne({
      where: {
        address: tokenDto.address,
        chain: {
          chainId: tokenDto.chainId
        }
      }
    });

    if (existingToken) {
        return existingToken;
    }

    const chain = await this.chainsRepository.findOne({
      where: { chainId: tokenDto.chainId },
    });

    if (!chain) throw new Error(`Chain с id ${tokenDto.chainId} не найден`);

    const token = this.tokensRepository.create({
      address: tokenDto.address,
      symbol: tokenDto.symbol,
      tokenName: tokenDto.tokenName,
      decimals: +tokenDto.decimals,
      chain, // связь с объектом chain
      isActive: null,
      isChecked: null,
      balance: null,
    });

    return await this.tokensRepository.save(token);
  }

  async findAll() {
    return await this.tokensRepository.find({
      relations: ['chain'],
      order: {
        tokenId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const token = await this.tokensRepository.findOne({
      where: { tokenId: id },
      relations: ['chain'],
    });

    if (!token) {
      throw new Error(`Token with id ${id} not found`);
    }
    return token;
  }

  async findOneByAddress(tokenAddress: string) {
    console.log(tokenAddress);
    const token = await this.tokensRepository.findOne({
      where: { address: tokenAddress },
      relations: ['chain'],
    });

    if (!token) {
      throw new Error(`Token with address ${tokenAddress} not found`);
    }
    return token;
  }

  async update(id: number, tokenDto: CreateTokenDto) {
    const token = await this.findOne(id);
    const chain = await this.chainService.findOne(tokenDto.chainId);

    token.address = tokenDto.address;
    token.symbol = tokenDto.symbol;
    token.tokenName = tokenDto.tokenName;
    token.decimals = tokenDto.decimals;
    token.isActive = null;
    token.isChecked = null;
    token.balance = null;
    token.chain = chain;


    return await this.tokensRepository.save(token);
  }

  async remove(id: number) {
    return await this.tokensRepository.delete(id);
  }
}
