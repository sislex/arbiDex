import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotDto } from '../dtos/bots-dto/bot.dto';

@Controller('bots')
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  create(@Body() createBotDto: BotDto) {
    return this.botsService.create(createBotDto);
  }

  @Get()
  async findAll() {
    const bots = await this.botsService.findAll();
    return bots.map(bot => ({
      botId: bot.botId,
      botName: bot.botName,
      delayBetweenRepeat: bot.delayBetweenRepeat,
      description: bot.description,
      isRepeat: bot.isRepeat,
      maxErrors: bot.maxErrors,
      maxJobs: bot.maxJobs,
      paused: bot.paused,
      timeoutMs: bot.timeoutMs,

      poolsCount: bot.job?.poolsJobRelations?.length ?? 0,

      serverId: bot.server?.serverId,
      jobId: bot.job?.jobId ?? null,
      cexJobId: bot.cexJob?.id ?? null,
    }));
  }

  @Get('findAllByServerId')
  findAllByServerId(@Query('serverId') serverId: string) {
    return this.botsService.findAllByServerId(serverId);
  }

  @Get('findAllByJobId')
  async findAllByJobId(@Query('jobId') jobId: string) {
    const bots = await this.botsService.findAllByJobId(jobId);
    return bots.map((bot) => ({
      botId: bot.botId,
      botName: bot.botName,
      delayBetweenRepeat: bot.delayBetweenRepeat,
      description: bot.description,
      isRepeat: bot.isRepeat,
      maxErrors: bot.maxErrors,
      maxJobs: bot.maxJobs,
      paused: bot.paused,
      timeoutMs: bot.timeoutMs,
      poolsCount: bot.job?.poolsJobRelations?.length ?? 0,
      serverId: bot.server?.serverId,
      serverName: bot.server?.serverName ?? null,
      jobId: bot.job?.jobId ?? null,
      cexJobId: bot.cexJob?.id ?? null,
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBotDto: BotDto) {
    return this.botsService.update(+id, updateBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botsService.remove(+id);
  }
}
