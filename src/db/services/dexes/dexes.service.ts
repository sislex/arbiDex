import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dexes } from '../../entities/Dexes';

@Injectable()
export class DexesService {
  constructor(
    @InjectRepository(Dexes)
    private readonly dexesRepo: Repository<Dexes>,
  ) {}

  // Получить все записи
  async getAll(): Promise<Dexes[]> {
    return this.dexesRepo.find();
  }

  // Получить запись по name
  async getByName(name: string): Promise<Dexes | null> {
    return this.dexesRepo.findOne({
      where: { name },
    });
  }

  // Получить все записи и их pools c токенами
  async getAllWithPoolsAndTokens(): Promise<Dexes[]> {
    return this.dexesRepo.find({
      relations: {
        dexPools: {
          market: {
            baseToken: true,
            quoteToken: true,
          },
        },
      },
    });
  }

  // Получить все записи и их pools c токенами
  async getAllWithExistPools(): Promise<Dexes[]> {
    return this.dexesRepo
      .createQueryBuilder('dex')
      .innerJoin('dex.dexPools', 'dp') // оставит только dex с хотя бы одним пулом
      .leftJoinAndSelect('dex.dexPools', 'dexPools')
      .leftJoinAndSelect('dexPools.market', 'market')
      .leftJoinAndSelect('market.baseToken', 'baseToken')
      .leftJoinAndSelect('market.quoteToken', 'quoteToken')
      .distinct(true) // во избежание дублей dex при множестве пулов
      .getMany();

  }
}
