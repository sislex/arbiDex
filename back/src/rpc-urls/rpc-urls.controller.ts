import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RpcUrlsService } from './rpc-urls.service';
import { RpcUrlsDto } from '../dtos/rpc-urls-dto/rpc-urls.dto';

@Controller('rpc-urls')
export class RpcUrlsController {
  constructor(private readonly rpcUrlsService: RpcUrlsService) {}

  @Post()
  create(@Body() createRpcUrlDto: RpcUrlsDto) {
    return this.rpcUrlsService.create(createRpcUrlDto);
  }

  @Get()
  findAll() {
    return this.rpcUrlsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rpcUrlsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRpcUrlDto: RpcUrlsDto) {
    return this.rpcUrlsService.update(+id, updateRpcUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rpcUrlsService.remove(+id);
  }
}
