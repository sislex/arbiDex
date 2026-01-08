import { Injectable } from '@nestjs/common';
import { RpcUrlsDto } from '../dtos/rpc-urls-dto/rpc-urls.dto';

@Injectable()
export class RpcUrlsService {
  create(createRpcUrlDto: RpcUrlsDto) {
    return 'This action adds a new rpcUrl';
  }

  findAll() {
    return `This action returns all rpcUrls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rpcUrl`;
  }

  update(id: number, updateRpcUrlDto: RpcUrlsDto) {
    return `This action updates a #${id} rpcUrl`;
  }

  remove(id: number) {
    return `This action removes a #${id} rpcUrl`;
  }
}
