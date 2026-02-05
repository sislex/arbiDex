import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotes } from '../entities/entities/Quotes';
import { Tokens } from '../entities/entities/Tokens';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quotes, Tokens]),
    TokensModule
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
  exports: [QuotesService],
})
export class QuotesModule {}
