import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Get()
  public findAll() {
    return this.clienteService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateClienteDto) {
    return this.clienteService.create(dto);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.clienteService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.clienteService.remove(id);
  }
}
