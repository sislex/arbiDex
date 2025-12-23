import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { JobBotRelationsService } from './job-bot-relations.service';
import { JobBotRelationsDto } from '../dtos/job-bot-relations-dto/job-bot-relations.dto';

@Controller('job-bot-relations')
export class JobBotRelationsController {
  constructor(
    private readonly jobBotRelationsService: JobBotRelationsService,
  ) {}

  @Post()
  create(@Body() createJobBotRelationDto: JobBotRelationsDto) {
    return this.jobBotRelationsService.create(createJobBotRelationDto);
  }

  @Get()
  findAll() {
    return this.jobBotRelationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobBotRelationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobBotRelationDto: JobBotRelationsDto,
  ) {
    return this.jobBotRelationsService.update(+id, updateJobBotRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobBotRelationsService.remove(+id);
  }
}
