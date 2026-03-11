import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './main/tokens/tokens.module';
import { ChainsModule } from './main/chains/chains.module';
import { PoolsModule } from './main/pools/pools.module';
import { ServersModule } from './main/servers/servers.module';
import { DexesModule } from './main/dexes/dexes.module';
import { JobsModule } from './main/jobs/jobs.module';
import { BotsModule } from './main/bots/bots.module';
import { PairsModule } from './main/pairs/pairs.module';
import { QuotesModule } from './main/quotes/quotes.module';
import { PairQuoteRelationsModule } from './main/pair-quote-relations/pair-quote-relations.module';
import { QuoteJobRelationsModule } from './main/quote-job-relations/quote-job-relations.module';
import { RpcUrlsModule } from './main/rpc-urls/rpc-urls.module';
import { GetFeeModule } from './main/services/get-fee.module';
import { SwapRateModule } from './main/swap-rate/swap-rate.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { QuotesGraphModule } from './graph/quotes_graph/quotes_graph.module';

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
        entities: [__dirname + '/entities/main/entities/*.{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        ssl:
          cfg.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: Number(cfg.get<string>('DB_PORT_ANALYTICS') ?? 6543),
        username: cfg.get<string>('POSTGRES_USER'),
        password: cfg.get<string>('POSTGRES_PASSWORD'),
        database: cfg.get<string>('POSTGRES_DB_ANALYTICS'),
        entities: [__dirname + '/entities/analytics/*.entity{.ts,.js}'],
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
    RpcUrlsModule,
    GetFeeModule,
    SwapRateModule,
    BlockchainModule,
    QuotesGraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
