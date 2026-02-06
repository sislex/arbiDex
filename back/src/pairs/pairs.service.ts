import { Injectable } from '@nestjs/common';
import { PairDto } from '../dtos/pairs-dto/pair.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pairs } from '../entities/entities/Pairs';
import { Repository } from 'typeorm';
import { PoolsService } from '../pools/pools.service';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class PairsService {
  constructor(
    @InjectRepository(Pairs)
    private pairsRepository: Repository<Pairs>,
    private poolsService: PoolsService,
    private tokensService: TokensService,
  ) {}
  async create(createPairDto: PairDto) {
    const pool = await this.poolsService.findOne(createPairDto.poolId);
    const tokenIn = await this.tokensService.findOne(createPairDto.tokenIn);
    const tokenOut = await this.tokensService.findOne(createPairDto.tokenOut);

    const pair = this.pairsRepository.create({
      pool,
      tokenIn,
      tokenOut,
    });

    return this.pairsRepository.save(pair);
  }

  async findAll() {
    return await this.pairsRepository.find({
      relations: {
        pool: {
          dex: true,
          chain: true,
          token: true,
          token2: true,
        },
        tokenIn: true,
        tokenOut: true,
      },
      take: 1000,
      order: {
        pairId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const item = await this.pairsRepository.findOne({
      where: { pairId: id.toString() },
    });

    if (!item) {
      throw new Error(`Pair with id ${id} not found`);
    }

    return item;
  }

  async update(id: number, updatePairDto: PairDto) {
    const pair = await this.findOne(id);

    pair.pool = await this.poolsService.findOne(updatePairDto.poolId);
    pair.tokenIn = await this.tokensService.findOne(updatePairDto.tokenIn);
    pair.tokenOut = await this.tokensService.findOne(updatePairDto.tokenOut);

    return await this.pairsRepository.save(pair);
  }

  remove(id: number) {
    return this.pairsRepository.delete(id);
  }
}
