import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AjustarStockDto } from './dto/ajustar-stock.dto';

@ApiTags('productos')
@ApiBearerAuth()
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  public findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.productoService.findOne(id);
  }

  @Post()
  public create(@Body() dto: CreateProductoDto) {
    return this.productoService.create(dto);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.productoService.update(id, dto);
  }

  @Post(':id/ajustar-stock')
  public ajustarStock(@Param('id') id: string, @Body() dto: AjustarStockDto) {
    return this.productoService.ajustarStock(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.productoService.remove(id);
  }
}
