import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobDto } from '../dtos/jobs-dto/job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: JobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  async findAll() {
    const jobs = await this.jobsService.findAll();
    return jobs.map((j) => ({
      jobId: j.jobId,
      jobType: j.jobType,
      description: j.description,
      extraSettings: j.extraSettings,
      chainId: j.chain.chainId,
      rpcUrlId: j.rpcUrl.rpcUrlId,
      poolsCount: j.poolsCount ?? j.poolsJobRelations?.length ?? 0,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const job = await this.jobsService.findOne(+id);
    return {
      jobId: job.jobId,
      jobType: job.jobType,
      description: job.description,
      extraSettings: job.extraSettings,
      chainId: job.chain?.chainId,
      rpcUrlId: job.rpcUrl?.rpcUrlId,
      poolsCount: job.poolsCount ?? 0,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateJobDto: JobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
