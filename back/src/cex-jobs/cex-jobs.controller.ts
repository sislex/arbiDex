import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put, Patch,
} from '@nestjs/common';
import { CexJobsService } from './cex-jobs.service';
import { CexJobDto } from '../dtos/cex-jobs-dto/cex-job.dto';
import { BulkDeleteCexJobsDto } from '../dtos/cex-jobs-dto/bulk-delete-cex-jobs.dto';

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

  @Post('bulk-delete')
  removeMany(@Body() body: BulkDeleteCexJobsDto) {
    return this.cexJobsService.removeMany(body.ids ?? []);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cexJobsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCexJobDto: CexJobDto) {
    return this.cexJobsService.update(+id, updateCexJobDto);
  }

  @Patch(':id/status')
  async setStatus(
    @Param('id') id: string,
    @Body('checked') checked: boolean | null
  ) {
    return this.cexJobsService.setCheckedStatus(+id, checked);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cexJobsService.remove(+id);
  }
}
