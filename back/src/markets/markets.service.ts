import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Markets } from '../entities/entities/Markets';
import { MarketDto } from '../dtos/markets-dto/market.dto';
import { Pools } from '../entities/entities/Pools';
// import { CreateMarketDto } from './dto/create-market.dto';
// import { UpdateMarketDto } from './dto/update-market.dto';

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
    });
  }

  // update(id: number, updateMarketDto: UpdateMarketDto) {
  //   return `This action updates a #${id} market`;
  // }

  async remove(id: number) {
    return await this.marketsRepository.delete(id);
  }
}
