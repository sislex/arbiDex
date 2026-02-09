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
    return bots.map(bots => ({

      botId: bots.botId,
      botName: bots.botName,
      delayBetweenRepeat: bots.delayBetweenRepeat,
      description: bots.description,
      isRepeat: bots.isRepeat,
      maxErrors: bots.maxErrors,
      maxJobs: bots.maxJobs,
      paused:bots.paused,
      timeoutMs: bots.timeoutMs,
      pairsCount: bots.job.quoteJobRelations.length,
      serverId: bots.server.serverId,
      jobId: bots.job.jobId,
    }));
  }

  @Get('findAllByServerId')
  findAllByServerId(@Query('serverId') serverId: string) {
    return this.botsService.findAllByServerId(serverId);
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
