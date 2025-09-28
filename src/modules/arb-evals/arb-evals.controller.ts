// src/discovery/discovery.controller.ts
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArbEvalsService } from '../../db/services/arbEvals/arb-evals.service';

@ApiTags('quotes')
@Controller('api/quotes')
export class ArbEvalsController {
  constructor(
    private readonly arbEvalsService: ArbEvalsService,
  ) {}

}
