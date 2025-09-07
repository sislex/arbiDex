import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DexProviderService } from './services/dex-provider/dex-provider.service';
import { OpportunityService } from './services/opportunity/opportunity.service';
import { Runner } from './runner';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, DexProviderService, OpportunityService, Runner],
})
export class AppModule {}
