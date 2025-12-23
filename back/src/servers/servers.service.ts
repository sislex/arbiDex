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
    return await this.serverRepository.delete(id);
  }
}
