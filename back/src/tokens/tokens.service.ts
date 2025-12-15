import { Injectable } from '@nestjs/common';
import { TokenDto } from '../dtos/token-dto/token.dto';
import { UpdateTokenDto } from '../dtos/token-dto/update-token.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Tokens} from '../entities/entities/Tokens';
import {Repository} from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
      @InjectRepository(Tokens)
      private tokensRepository: Repository<Tokens>,
  ) {
  }
  create(tokenDto: TokenDto) {
    return 'This action adds a new token';
  }

  async findAll() {
    return await this.tokensRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }




}
