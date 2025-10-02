import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Runner } from './bots/runner';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dexes } from './db/entities/Dexes';
import { Tokens } from './db/entities/Tokens';
import { Markets } from './db/entities/Markets';
import { ArbEvals } from './db/entities/ArbEvals';
import { Quotes } from './db/entities/Quotes';
import { DexQuoteModule } from './dex-quote/dex-quote.module';
import { TokensService } from './db/services/tokens/tokens.service';
import { DexPools } from './db/entities/DexPools';
import { DexesService } from './db/services/dexes/dexes.service';
import { QuotesService } from './db/services/quotes/quotes.service';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { ArbEvalsService } from './db/services/arbEvals/arb-evals.service';
import { ArbEvalsModule } from './modules/arb-evals/arb-evals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('DB_HOST'),
        port: Number(cfg.get<string>('DB_PORT') ?? 5432),
        username: cfg.get<string>('DB_USER'),
        password: cfg.get<string>('DB_PASS'),
        database: cfg.get<string>('DB_NAME'),
        entities: [__dirname + '/db/entities/*.ts'],
        ssl:
          cfg.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        // либо перечисли сущности вручную, либо включи авто-подхват:
        autoLoadEntities: true,
        synchronize: false, // ВАЖНО: таблицы уже созданы SQL-скриптом, синк отключен
        // logging: ['error'], // при необходимости
      }),
    }),
    TypeOrmModule.forFeature([
      Dexes,
      Tokens,
      Markets,
      ArbEvals,
      Quotes,
      DexPools,
    ]),
    DexQuoteModule,
    DiscoveryModule,
    QuotesModule,
    ArbEvalsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Runner,
    TokensService,
    DexesService,
    QuotesService,
    ArbEvalsService,
  ],
})
export class AppModule {}
