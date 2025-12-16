import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tokens } from '../entities/entities/Tokens';
import { Repository } from 'typeorm';
import { CreateTokenDto } from '../dtos/token-dto/token.dto';
import { Chains } from '../entities/entities/Chains';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Tokens)
    private tokensRepository: Repository<Tokens>,
    @InjectRepository(Chains)
    private chainsRepository: Repository<Chains>,
  ) {}

  async create(tokenDto: CreateTokenDto) {
    const chain = await this.chainsRepository.findOne({
      where: { chainId: tokenDto.chainId },
    });
    if (!chain) throw new Error(`Chain с id ${tokenDto.chainId} не найден`);

    const token = this.tokensRepository.create({
      address: tokenDto.address,
      symbol: tokenDto.symbol,
      tokenName: tokenDto.tokenName,
      decimals: tokenDto.decimals,
      chain,
    });

    return await this.tokensRepository.save(token);
  }

  async findAll() {
    console.log(
      await this.tokensRepository.find({
        relations: ['chain'],
      }),
    );
    return await this.tokensRepository.find({
      relations: ['chain'],
    });
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
  async remove(id: number) {
    return await this.tokensRepository.delete(id);
  }
}
