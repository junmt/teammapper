import {
  Body, Controller, Get, Delete, NotFoundException, Param, Post,
} from '@nestjs/common';
import { MmpMap } from '../entities/mmpMap.entity';
import { MapsService } from '../services/maps.service';
import { IMmpClientDeleteRequest, IMmpClientMap, IMmpClientMapCreateRequest, IMmpClientPrivateMap } from '../types';

@Controller('api/maps')
export default class MapsController {
  constructor(private mapsService: MapsService) {}

  @Get(':id')
  async findOne(@Param('id') mapId: string): Promise<IMmpClientMap> {
    const map: IMmpClientMap = await this.mapsService.exportMapToClient(mapId);
    if (map === null) throw new NotFoundException();

    return map;
  }

  @Delete(':id')
  async delete(@Param('id') mapId: string, @Body() body: IMmpClientDeleteRequest): Promise<void> {
    const mmpMap: MmpMap = await this.mapsService.findMap(mapId);
    if (mmpMap.adminId === body.adminId) this.mapsService.deleteMap(mapId);
  }

  @Post()
  async create(@Body() body: IMmpClientMapCreateRequest): Promise<IMmpClientPrivateMap> {
    const newMap: MmpMap = await this.mapsService.createEmptyMap(body.rootNode);
    return { 
      map: await this.mapsService.exportMapToClient(newMap.id),
      adminId: newMap.adminId,
      modificationSecret: newMap.modificationSecret
    };
  }
}
