import { Module } from '@nestjs/common';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bots } from '../entities/entities/Bots';
import { ServersModule } from '../servers/servers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bots]), ServersModule],
  controllers: [BotsController],
  providers: [BotsService],
  exports: [BotsService],
})
export class BotsModule {}
