import { Injectable } from '@nestjs/common';
import { CexJobDto } from '../dtos/cex-jobs-dto/cex-job.dto';

@Injectable()
export class CexJobsService {
  create(createCexJobDto: CexJobDto) {
    return 'This action adds a new cexJob';
  }

  findAll() {
    return `This action returns all cexJobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cexJob`;
  }

  update(id: number, updateCexJobDto: CexJobDto) {
    return `This action updates a #${id} cexJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} cexJob`;
  }
}
