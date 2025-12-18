import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Markets } from '../entities/entities/Markets';
import { MarketDto } from '../dtos/markets-dto/market.dto';
import { Pools } from '../entities/entities/Pools';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Markets)
    private marketsRepository: Repository<Markets>,
    @InjectRepository(Pools)
    private poolRepository: Repository<Pools>,
  ) {}

  async create(marketDto: MarketDto) {
    const pool = await this.poolRepository.findOne({
      where: { poolId: marketDto.poolId },
    });
    if (!pool) throw new Error(`Chain с id ${marketDto.poolId} не найден`);

    const market = this.marketsRepository.create({
      pool,
      amount: marketDto.amount,
    });

    return await this.marketsRepository.save(market);
  }

  async findAll() {
    return await this.marketsRepository.find({
      relations: ['pool'],
      order: {
        marketId: 'DESC',
      },
    });
  }

  async update(id: number, marketDto: MarketDto) {
    const market = await this.marketsRepository.findOne({
      where: { marketId: id },
      relations: ['pool'],
    });
    if (!market) {
      throw new Error(`Market с id ${id} не найден`);
    }

    const pool = await this.poolRepository.findOne({
      where: { poolId: marketDto.poolId },
    });
    if (!pool) throw new Error(`Chain с id ${marketDto.poolId} не найден`);

    market.marketId = marketDto.marketId;
    market.pool = pool;
    market.amount = marketDto.amount;

    return await this.marketsRepository.save(market);
  }

  async remove(id: number) {
    return await this.marketsRepository.delete(id);
  }
}
