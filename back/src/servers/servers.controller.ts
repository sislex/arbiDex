import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServerDto } from '../dtos/servers-dto/server.dto';
import { BulkDeleteServersDto } from '../dtos/servers-dto/bulk-delete-servers.dto';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  create(@Body() createServerDto: ServerDto) {
    return this.serversService.create(createServerDto);
  }

  @Post('bulk-delete')
  removeMany(@Body() body: BulkDeleteServersDto) {
    return this.serversService.removeMany(body.ids ?? []);
  }

  @Get()
  findAll() {
    return this.serversService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serversService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateServerDto: ServerDto) {
    return this.serversService.update(+id, updateServerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serversService.remove(+id);
  }
}
