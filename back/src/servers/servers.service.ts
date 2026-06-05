import { Injectable } from '@nestjs/common';
import { ServerDto } from '../dtos/servers-dto/server.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servers } from '../entities/entities/Servers';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(Servers)
    private serverRepository: Repository<Servers>,
  ) {}

  async create(createServerDto: ServerDto) {
    const server = this.serverRepository.create({
      ip: createServerDto.ip,
      port: createServerDto.port,
      serverName: createServerDto.serverName,
    });
    return await this.serverRepository.save(server);
  }

  async findAll() {
    return await this.serverRepository.find({
      order: {
        serverId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const server = await this.serverRepository.findOne({
      where: { serverId: id.toString() },
    });
    if (!server) {
      throw new Error(`Server with id ${id} not found`);
    }
    return server;
  }

  async update(id: number, updateServerDto: ServerDto) {
    const server = await this.findOne(id);

    server.ip = updateServerDto.ip;
    server.port = updateServerDto.port;
    server.serverName = updateServerDto.serverName;

    return await this.serverRepository.save(server);
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

    const result = await this.serverRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new Error('No servers were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
