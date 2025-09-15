import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DexProviderService } from './services/dex-provider/dex-provider.service';
import { OpportunityService } from './services/opportunity/opportunity.service';
import { Runner } from './runner';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dexes } from './db/entities/Dexes';
import { Tokens } from './db/entities/Tokens';
import { Markets } from './db/entities/Markets';
import { ArbEvals } from './db/entities/ArbEvals';
import { Quotes } from './db/entities/Quotes';
import { QuotesService } from './db/services/quotes.service';
import { DexQuoteModule } from './dex-quote/dex-quote.module';

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
    TypeOrmModule.forFeature([Dexes, Tokens, Markets, ArbEvals, Quotes]),
    DexQuoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DexProviderService,
    OpportunityService,
    Runner,
    QuotesService,
  ],
})
export class AppModule {}
