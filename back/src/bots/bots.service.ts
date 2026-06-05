import { Injectable } from '@nestjs/common';
import { BotDto } from '../dtos/bots-dto/bot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bots } from '../entities/entities/Bots';
import { Repository } from 'typeorm';
import { ServersService } from '../servers/servers.service';
import { JobsService } from '../jobs/jobs.service';
import { Jobs } from '../entities/entities/Jobs';
import {CexJob} from "../entities/entities/cex-job.entity";
import {CexJobsService} from "../cex-jobs/cex-jobs.service";

@Injectable()
export class BotsService {
  constructor(
    @InjectRepository(Bots)
    private botRepository: Repository<Bots>,
    private serverService: ServersService,
    private jobService: JobsService,
    private cexJobService: CexJobsService,
  ) {}
  async create(createBotDto: BotDto) {
    const server = await this.serverService.findOne(createBotDto.serverId);

    let job: Jobs | undefined = undefined;
    let cexJob: CexJob | undefined = undefined;

    if (createBotDto.jobId) {
      const foundJob = await this.jobService.findOneWithPairs(createBotDto.jobId);
      job = (foundJob as any) || undefined;
    }

    if (createBotDto.cexJobId) {
      const foundCexJob = await this.cexJobService.findOne(createBotDto.cexJobId);
      cexJob = foundCexJob || undefined;
    }

    const bot = this.botRepository.create({
      botName: createBotDto.botName,
      description: createBotDto.description,
      server: server,
      job: job,
      cexJob: cexJob,
      paused: createBotDto.paused,
      isRepeat: createBotDto.isRepeat,
      delayBetweenRepeat: createBotDto.delayBetweenRepeat,
      maxJobs: createBotDto.maxJobs,
      maxErrors: createBotDto.maxErrors,
      timeoutMs: createBotDto.timeoutMs,
    });
    return await this.botRepository.save(bot);
  }

  async findAll() {
    return await this.botRepository.find({
      relationLoadStrategy: 'query',
      relations: {
        server: true,
        job: {
          poolsJobRelations: true,
        },
        cexJob: true,
      },
      select: {
        botId: true,
        botName: true,
        description: true,
        paused: true,
        isRepeat: true,
        delayBetweenRepeat: true,
        maxErrors: true,
        maxJobs: true,
        timeoutMs: true,
        job: {
          jobId: true,
          poolsJobRelations: {
            poolsJobRelationId: true,
          },
        },
        server: {
          serverId: true,
        },
        cexJob: {
          id: true,
        },
      },
      order: {
        botId: 'DESC',
      },
    });
  }

  async findAllByJobId(jobId: string) {
    return await this.botRepository.find({
      relationLoadStrategy: 'query',
      relations: {
        server: true,
        job: {
          poolsJobRelations: true,
        },
        cexJob: true,
      },
      select: {
        botId: true,
        botName: true,
        description: true,
        paused: true,
        isRepeat: true,
        delayBetweenRepeat: true,
        maxErrors: true,
        maxJobs: true,
        timeoutMs: true,
        job: {
          jobId: true,
          jobType: true,
          poolsJobRelations: {
            poolsJobRelationId: true,
          },
        },
        server: {
          serverId: true,
          serverName: true,
        },
        cexJob: {
          id: true,
        },
      },
      where: {
        job: { jobId },
      },
      order: { botId: 'DESC' },
    });
  }

  async findAllByServerId(serverId: string) {
    return await this.botRepository.find({
      relationLoadStrategy: 'join',
      relations: {
        server: true,
        job: {
          chain: true,
          rpcUrl: true,
          poolsJobRelations: {
            pool: {
              dex: true,
              chain: true,
              token0: true,
              token1: true,
            },
          },
        },
        cexJob: {
          pair: {
            chain: true,
          },
        },
      },
      where: {
        server: { serverId: serverId },
      },
      order: { botId: 'DESC' },
    });
  }

  async findOne(id: number) {
    const bot = await this.botRepository.findOne({
      relations: ['server', 'job'],
      where: { botId: id.toString() },
    });
    if (!bot) {
      throw new Error(`Bot with id ${id} not found`);
    }
    return bot;
  }

  async update(id: number, updateBotDto: BotDto) {
    const bot = await this.findOne(id);

    let job: Jobs | null = null;
    let cexJob: CexJob | null = null;

    const server = await this.serverService.findOne(updateBotDto.serverId);

    if (updateBotDto.jobId) {
      const foundJob = await this.jobService.findOne(updateBotDto.jobId);
      job = (foundJob as any) || null;
    }

    if (updateBotDto.cexJobId) {
      const foundCexJob = await this.cexJobService.findOne(updateBotDto.cexJobId);
      cexJob = foundCexJob || null;
    }

    bot.botName = updateBotDto.botName;
    bot.description = updateBotDto.description;
    bot.server = server;
    bot.job = job;
    bot.cexJob = cexJob;

    bot.paused = updateBotDto.paused;
    bot.isRepeat = updateBotDto.isRepeat;
    bot.delayBetweenRepeat = updateBotDto.delayBetweenRepeat;
    bot.maxJobs = updateBotDto.maxJobs;
    bot.maxErrors = updateBotDto.maxErrors;
    bot.timeoutMs = updateBotDto.timeoutMs;

    return await this.botRepository.save(bot);
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

    const result = await this.botRepository.delete(uniqueIds);
    if ((result.affected ?? 0) === 0) {
      throw new Error('No bots were deleted');
    }

    return { success: true as const, deletedIds: uniqueIds };
  }
}
