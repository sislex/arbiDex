import { forwardRef, Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jobs } from '../entities/entities/Jobs';
import { ChainsModule } from '../chains/chains.module';
import { RpcUrlsModule } from '../rpc-urls/rpc-urls.module';
import { RpcUrls } from '../entities/entities/RpcUrls';
import { QuoteJobRelationsModule } from '../quote-job-relations/quote-job-relations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jobs, RpcUrls]),
    forwardRef(() => QuoteJobRelationsModule),
    ChainsModule,
    RpcUrlsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
