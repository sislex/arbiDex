import { Injectable } from '@nestjs/common';
import { BotDto } from '../dtos/bots-dto/bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from '../entities/entities/Bots';
import { Repository } from 'typeorm';
import { ServersService } from '../servers/servers.service';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bots)
    private botRepository: Repository<Bots>,
    private serverService: ServersService,
  ) {}
  async create(createBotDto: BotDto) {
    const server = await this.serverService.findOne(createBotDto.server);

    const bot = this.botRepository.create({
      botName: createBotDto.botName,
      description: createBotDto.description,
      server: server,
    });
    return await this.botRepository.save(bot);
  }

  async findAll() {
    return await this.botRepository.find({
      relations: ['server'],
      order: {
        botId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const bot = await this.botRepository.findOne({
      where: { botId: id.toString() },
    });
    if (!bot) {
      throw new Error(`Job с id ${id} не найден`);
    }
    return bot;
  }

  async update(id: number, updateBotDto: BotDto) {
    const bot = await this.findOne(id);

    const server = await this.serverService.findOne(updateBotDto.server);

    bot.botName = updateBotDto.botName;
    bot.description = updateBotDto.description;
    bot.server = server;

    return await this.botRepository.save(bot);
  }

  async remove(id: number) {
    return this.botRepository.delete(id);
  }
}
