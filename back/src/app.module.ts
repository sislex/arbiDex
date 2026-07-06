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
import { PoolJobRelationsModule } from './pool-job-relations/pool-job-relations.module';
import { RpcUrlsModule } from './rpc-urls/rpc-urls.module';
import { GetFeeModule } from './services/get-fee.module';
import { SwapRateModule } from './swap-rate/swap-rate.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { Tokens } from './entities/entities/Tokens';
import { Pools } from './entities/entities/Pools';
import { Chains } from './entities/entities/Chains';
import { Dexes } from './entities/entities/Dexes';
import { Servers } from './entities/entities/Servers';
import { Jobs } from './entities/entities/Jobs';
import { Bots } from './entities/entities/Bots';
import { PoolsJobRelations } from './entities/entities/PoolsJobRelations';
import { CexPairsModule } from './cex-pairs/cex-pairs.module';
import { CexChainsModule } from './cex-chains/cex-chains.module';
import { CexJobsModule } from './cex-jobs/cex-jobs.module';
import { AgentSkillModule } from './agent-skill/agent-skill.module';
import { CexJob } from './entities/entities/cex-job.entity';
import { CexPair } from './entities/entities/cex-pair.entity';
import { CexChain } from './entities/entities/cex-chain.entity';

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
          PoolsJobRelations,
          CexChain,
          CexPair,
          CexJob
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
    PoolJobRelationsModule,
    RpcUrlsModule,
    GetFeeModule,
    SwapRateModule,
    BlockchainModule,
    CexChainsModule,
    CexPairsModule,
    CexJobsModule,
    AgentSkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
