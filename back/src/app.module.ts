import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';
import { ChainsModule } from './chains/chains.module';
import { PoolsModule } from './pools/pools.module';
import { ServersModule } from './servers/servers.module';
import { DexesModule } from './dexes/dexes.module';
import { Tokens } from './entities/entities/Tokens';
import { Pools } from './entities/entities/Pools';
import { Chains } from './entities/entities/Chains';
import { Dexes } from './entities/entities/Dexes';
import { Servers } from './entities/entities/Servers';
import { JobsModule } from './jobs/jobs.module';
import { BotsModule } from './bots/bots.module';
import { Jobs } from './entities/entities/Jobs';
import { Bots } from './entities/entities/Bots';
import { Quotes } from './entities/entities/Quotes';
import { QuoteJobRelations } from './entities/entities/QuoteJobRelations';
import { Pairs } from './entities/entities/Pairs';
import { PairQuoteRelations } from './entities/entities/PairQuoteRelations';
import { PairsModule } from './pairs/pairs.module';
import { QuotesModule } from './quotes/quotes.module';
import { PairQuoteRelationsModule } from './pair-quote-relations/pair-quote-relations.module';
import { QuoteJobRelationsModule } from './quote-job-relations/quote-job-relations.module';

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
        entities: [
          Tokens,
          Pools,
          Chains,
          Dexes,
          Servers,
          Jobs,
          Bots,
          Quotes,
          QuoteJobRelations,
          Pairs,
          PairQuoteRelations,
        ],
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
    PoolsModule,
    ServersModule,
    DexesModule,
    JobsModule,
    BotsModule,
    PairsModule,
    QuotesModule,
    PairQuoteRelationsModule,
    QuoteJobRelationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
