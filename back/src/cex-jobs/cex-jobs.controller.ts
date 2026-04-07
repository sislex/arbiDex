import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CexJobsService } from './cex-jobs.service';
import { CexJobDto } from '../dtos/cex-jobs-dto/cex-job.dto';

@Controller('cex-jobs')
export class CexJobsController {
  constructor(private readonly cexJobsService: CexJobsService) {}

  @Post()
  create(@Body() createCexJobDto: CexJobDto) {
    return this.cexJobsService.create(createCexJobDto);
  }

  @Get()
  findAll() {
    return this.cexJobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cexJobsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCexJobDto: CexJobDto) {
    return this.cexJobsService.update(+id, updateCexJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cexJobsService.remove(+id);
  }
}
