import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '../entities/entities/Tokens';
import { Repository } from 'typeorm';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';
import { Chains } from '../entities/entities/Chains';
import { ChainsService } from '../chains/chains.service';

interface TokenFilter {
  address?: string;
  chainId?: number;
}

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
      chain,
      isActive: null,
      isChecked: null,
      balance: null,
    });

    return await this.tokensRepository.save(token);
  }

  async findAll() {
    return await this.tokensRepository.find({
      relations: ['chain'],
      select: {
        tokenId: true,
        address: true,
        symbol: true,
        tokenName: true,
        decimals: true,
        chain: {
          chainId: true,
          name: true
        },
      },
      order: {
        tokenId: 'DESC',
      },
    });
  }

  async findAllWithFilter(filter: TokenFilter) {
    const where: any = {};
    if (filter.address) where.address = filter.address.toLowerCase();
    if (filter.chainId) where.chain = { chainId: filter.chainId };

    return this.tokensRepository.find({
      where,
      relations: ['chain'],
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

    const token = await this.tokensRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.chain', 'chain')
      .where('LOWER(token.address) = LOWER(:address)', { address: tokenAddress })
      .getOne();

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
