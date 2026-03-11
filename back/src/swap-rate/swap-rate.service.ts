import { Injectable } from '@nestjs/common';
import { CreateSwapRateDto } from '../dtos/swap-rate/create-swap-rate.dto';
import { UpdateSwapRateDto } from '../dtos/swap-rate/update-swap-rate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokensService } from '../tokens/tokens.service';
import { SwapRate } from '../entities/main/entities/SwapRate';

@Injectable()
export class SwapRateService {

  constructor(
    @InjectRepository(SwapRate)
    private swapRateRepository: Repository<SwapRate>,
    private tokensService: TokensService,
  ) {}

  create(createSwapRateDto: CreateSwapRateDto) {
    return 'This action adds a new swapRate';
  }

  async findAll() {
    return await this.swapRateRepository.find({
      relations: {
        swapRate0: true,
        swapRate1: true,
      },
      select: {
        swapRateId: true,
        swapRateCount: true,
        swapRate0: { tokenId: true },
        swapRate1: { tokenId: true },
      },
      order: {
        swapRateId: 'DESC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} swapRate`;
  }

  update(id: number, updateSwapRateDto: UpdateSwapRateDto) {
    return `This action updates a #${id} swapRate`;
  }

  remove(id: number) {
    return `This action removes a #${id} swapRate`;
  }
}
