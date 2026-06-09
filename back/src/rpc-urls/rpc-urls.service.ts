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
    const result = await this.removeMany([id]);
    return { deleted: true, deletedIds: result.deletedIds };
  }

  async removeMany(ids: number[]) {
    const uniqueIds = [
      ...new Set(
        (ids ?? [])
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id > 0),
      ),
    ];

    if (uniqueIds.length === 0) {
      return { success: true as const, deletedIds: [] as number[] };
    }

    for (const id of uniqueIds) {
      await this.findOne(id);
    }

    const result = await this.rpcUrlsRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new Error('No RPC URLs were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
