import { Injectable } from '@nestjs/common';
import { Tokens } from '../../entities/Tokens';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokensService {

  constructor(
    @InjectRepository(Tokens)
    private readonly tokensRepo: Repository<Tokens>,
  ) {}

  async getAll(): Promise<Tokens[]> {
    return this.tokensRepo.find();
  }
}
