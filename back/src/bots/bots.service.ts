import { Injectable } from '@nestjs/common';
import { BotDto } from '../dtos/bots-dto/bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from '../entities/entities/Bots';
import { Repository } from 'typeorm';
import { ServersService } from '../servers/servers.service';
import { JobsService } from '../jobs/jobs.service';

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bots)
    private botRepository: Repository<Bots>,
    private serverService: ServersService,
    private jobService: JobsService,
  ) {}
  async create(createBotDto: BotDto) {
    const server = await this.serverService.findOne(createBotDto.server);
    const job = await this.jobService.findOne(createBotDto.job);
    const bot = this.botRepository.create({
      botName: createBotDto.botName,
      description: createBotDto.description,
      server: server,
      job: job,
    });
    return await this.botRepository.save(bot);
  }

  async findAll() {
    return await this.botRepository.find({
      relations: ['server', 'job'],
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
      throw new Error(`Bot with id ${id} not found`);
    }
    return bot;
  }

  async update(id: number, updateBotDto: BotDto) {
    const bot = await this.findOne(id);

    const server = await this.serverService.findOne(updateBotDto.server);
    const job = await this.jobService.findOne(updateBotDto.job);

    bot.botName = updateBotDto.botName;
    bot.description = updateBotDto.description;
    bot.server = server;
    bot.job = job;

    return await this.botRepository.save(bot);
  }

  async remove(id: number) {
    return this.botRepository.delete(id);
  }
}
