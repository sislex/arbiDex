import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servers } from '../entities/main/entities/Servers';
import { Bots } from '../entities/main/entities/Bots';
import { Jobs } from '../entities/main/entities/Jobs';

@Module({
  imports: [TypeOrmModule.forFeature([Servers, Bots, Jobs])],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
