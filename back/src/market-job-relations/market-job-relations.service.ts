import { Injectable } from '@nestjs/common';
import { MarketJobRelationsDto } from '../dtos/market-job-relations-dto/market-job-relations.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketJobRelations } from '../entities/entities/MarketJobRelations';

@Injectable()
export class MarketJobRelationsService {
  constructor(
    @InjectRepository(MarketJobRelations)
    private marketJobRelationsRepository: Repository<MarketJobRelations>,
  ) {}
  create(createMarketJobRelationDto: MarketJobRelationsDto) {
    return 'This action adds a new marketJobRelation';
  }

  findAll() {
    return `This action returns all marketJobRelations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketJobRelation`;
  }

  update(id: number, updateMarketJobRelationDto: MarketJobRelationsDto) {
    return `This action updates a #${id} marketJobRelation`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketJobRelation`;
  }
}
