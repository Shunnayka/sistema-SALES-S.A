import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FacturaService } from './factura.service';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';

@ApiTags('facturas')
@ApiBearerAuth()
@Controller('facturas')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Get()
  public findAll() {
    return this.facturaService.findAll();
  }

  @Get(':numero')
  public findOne(@Param('numero') numero: string) {
    return this.facturaService.findOne(numero);
  }

  @Post()
  public registrarVenta(@Body() dto: RegistrarVentaDto) {
    return this.facturaService.registrarVenta(dto);
  }

  @Post(':numero/cancelar')
  public cancelar(@Param('numero') numero: string) {
    return this.facturaService.cancelar(numero);
  }

  @Post(':numero/anular')
  public anular(@Param('numero') numero: string) {
    return this.facturaService.anular(numero);
  }
}
