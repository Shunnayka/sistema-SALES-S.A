import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DistritoService } from './distrito.service';
import { CreateDistritoDto } from './dto/create-distrito.dto';
import { UpdateDistritoDto } from './dto/update-distrito.dto';

@ApiTags('distritos')
@ApiBearerAuth()
@Controller('distritos')
export class DistritoController {
  constructor(private readonly distritoService: DistritoService) {}

  @Get()
  public findAll() {
    return this.distritoService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.distritoService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateDistritoDto) {
    return this.distritoService.create(dto);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateDistritoDto) {
    return this.distritoService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.distritoService.remove(id);
  }
}
