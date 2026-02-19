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
import { JobsModule } from './jobs/jobs.module';
import { BotsModule } from './bots/bots.module';
import { PairsModule } from './pairs/pairs.module';
import { QuotesModule } from './quotes/quotes.module';
import { PairQuoteRelationsModule } from './pair-quote-relations/pair-quote-relations.module';
import { QuoteJobRelationsModule } from './quote-job-relations/quote-job-relations.module';
import { RpcUrlsModule } from './rpc-urls/rpc-urls.module';
import { GetFeeModule } from './services/get-fee.module';
import { SwapRateModule } from './swap-rate/swap-rate.module';
import { BlockchainModule } from './blockchain/blockchain.module';

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
          __dirname + '/src/**/*.entity{.ts,.js}',
          './src/entities/entities/*.ts',
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
    RpcUrlsModule,
    GetFeeModule,
    SwapRateModule,
    BlockchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
