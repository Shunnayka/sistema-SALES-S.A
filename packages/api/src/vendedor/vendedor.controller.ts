import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VendedorService } from './vendedor.service';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';

@ApiTags('vendedores')
@ApiBearerAuth()
@Controller('vendedores')
export class VendedorController {
  constructor(private readonly vendedorService: VendedorService) {}

  @Get()
  public findAll() {
    return this.vendedorService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.vendedorService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateVendedorDto) {
    return this.vendedorService.create(dto);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateVendedorDto) {
    return this.vendedorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.vendedorService.remove(id);
  }
}
