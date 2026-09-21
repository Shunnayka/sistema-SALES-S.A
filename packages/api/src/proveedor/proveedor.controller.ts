import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@ApiTags('proveedores')
@ApiBearerAuth()
@Controller('proveedores')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Get()
  public findAll() {
    return this.proveedorService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.proveedorService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateProveedorDto) {
    return this.proveedorService.create(dto);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateProveedorDto) {
    return this.proveedorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.proveedorService.remove(id);
  }
}
