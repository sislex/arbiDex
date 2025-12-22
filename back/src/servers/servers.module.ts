import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servers } from '../entities/entities/Servers';
import { Bots } from '../entities/entities/Bots';
import { JobBotRelations } from '../entities/entities/JobBotRelations';
import { Jobs } from '../entities/entities/Jobs';
import { Markets } from '../entities/entities/Markets';

@Module({
  imports: [
    TypeOrmModule.forFeature([Servers, Bots, JobBotRelations, Jobs, Markets]),
  ],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
