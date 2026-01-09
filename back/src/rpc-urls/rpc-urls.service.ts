import { Injectable } from '@nestjs/common';
import { RpcUrlsDto } from '../dtos/rpc-urls-dto/rpc-urls.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chains } from '../entities/entities/Chains';
import { ChainsService } from '../chains/chains.service';
import { RpcUrls } from '../entities/entities/RpcUrls';

@Injectable()
export class RpcUrlsService {
  constructor(
    @InjectRepository(RpcUrls)
    private rpcUrlsRepository: Repository<RpcUrls>,
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
    private chainService: ChainsService,
  ) {}

  async create(createRpcUrlDto: RpcUrlsDto) {
    const chain = await this.chainsRepository.findOne({
      where: { chainId: createRpcUrlDto.chainId },
    });

    if (!chain)
      throw new Error(`Chain с id ${createRpcUrlDto.chainId} не найден`);

    const rpcUrl = this.rpcUrlsRepository.create({
      rpcUrl: createRpcUrlDto.rpcUrl,
      chain,
    });

    return await this.rpcUrlsRepository.save(rpcUrl);
  }

  async findAll() {
    return await this.rpcUrlsRepository.find({
      relations: ['chain'],
      order: {
        rpcUrlId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const rpcUrl = await this.rpcUrlsRepository.findOne({
      where: { rpcUrlId: id },
      relations: ['chain'],
    });

    if (!rpcUrl) {
      throw new Error(`Rpc Url with id ${id} not found`);
    }
    return rpcUrl;
  }

  async update(id: number, updateRpcUrlDto: RpcUrlsDto) {
    const rpcUrl = await this.findOne(id);
    const chain = await this.chainService.findOne(updateRpcUrlDto.chainId);

    rpcUrl.rpcUrl = updateRpcUrlDto.rpcUrl;
    rpcUrl.chain = chain;

    return await this.rpcUrlsRepository.save(rpcUrl);
  }

  async remove(id: number) {
    return await this.rpcUrlsRepository.delete(id);
  }
}
