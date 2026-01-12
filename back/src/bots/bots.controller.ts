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
  findAll() {
    return this.botsService.findAll();
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
