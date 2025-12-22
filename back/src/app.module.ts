import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';
import { ChainsModule } from './chains/chains.module';
import { MarketsModule } from './markets/markets.module';
import { PoolsModule } from './pools/pools.module';
import { ServersModule } from './servers/servers.module';
import { DexesModule } from './dexes/dexes.module';
import { Tokens } from './entities/entities/Tokens';
import { Pools } from './entities/entities/Pools';
import { Chains } from './entities/entities/Chains';
import { Markets } from './entities/entities/Markets';
import { Dexes } from './entities/entities/Dexes';
import { Servers } from './entities/entities/Servers';
import { JobsModule } from './jobs/jobs.module';
import { BotsModule } from './bots/bots.module';
import { JobBotRelationsModule } from './job-bot-relations/job-bot-relations.module';
import { MarketJobRelationsModule } from './market-job-relations/market-job-relations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: Number(cfg.get<string>('DB_PORT') ?? 5432),
        username: cfg.get<string>('POSTGRES_USER'),
        password: cfg.get<string>('POSTGRES_PASSWORD'),
        database: cfg.get<string>('POSTGRES_DB'),
        entities: [Tokens, Pools, Chains, Markets, Dexes, Servers],
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          cfg.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    TokensModule,
    ChainsModule,
    MarketsModule,
    PoolsModule,
    ServersModule,
    DexesModule,
    JobsModule,
    BotsModule,
    JobBotRelationsModule,
    MarketJobRelationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
