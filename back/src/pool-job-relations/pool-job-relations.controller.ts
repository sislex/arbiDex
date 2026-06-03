import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PoolJobRelationsService } from './pool-job-relations.service';
import { PoolJobRelationDto } from '../dtos/pool-job-relations-dto/pool-job-relation.dto';

@Controller('pool-job-relations')
export class PoolJobRelationsController {
  constructor(
    private readonly poolJobRelationsService: PoolJobRelationsService,
  ) {}

  @Post()
  create(@Body() createPoolJobRelationDto: PoolJobRelationDto[]) {
    return this.poolJobRelationsService.createMany(createPoolJobRelationDto);
  }

  @Get('by-job-id/:id')
  findByJobId(@Param('id') id: string) {
    return this.poolJobRelationsService.findByJobId(id);
  }

  @Delete()
  remove(@Body() id: string[] | number[]) {
    return this.poolJobRelationsService.remove(id);
  }
}
