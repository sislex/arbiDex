import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '../entities/entities/Tokens';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepository: Repository<Tokens>,
  ) {}
  async create(tokenDto: any) {

    // symbol: 'USDT1',
    //   decimals: 6,
    const token = this.tokensRepository.create(tokenDto);
    return await this.tokensRepository.save(token);
  }

  async findAll() {
    return await this.tokensRepository.find();
  }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} token`;
  // }
  //
  // update(id: number, updateTokenDto: UpdateTokenDto) {
  //   return `This action updates a #${id} token`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} token`;
  // }
}
