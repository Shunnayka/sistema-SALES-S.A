import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdenCompraService } from './orden-compra.service';
import { RegistrarOrdenDto } from './dto/registrar-orden.dto';

@ApiTags('ordenes-compra')
@ApiBearerAuth()
@Controller('ordenes-compra')
export class OrdenCompraController {
  constructor(private readonly ordenCompraService: OrdenCompraService) {}

  @Get()
  public findAll() {
    return this.ordenCompraService.findAll();
  }

  @Get(':numero')
  public findOne(@Param('numero') numero: string) {
    return this.ordenCompraService.findOne(numero);
  }

  @Post()
  public registrarOrden(@Body() dto: RegistrarOrdenDto) {
    return this.ordenCompraService.registrarOrden(dto);
  }

  @Post(':numero/atender')
  public atender(@Param('numero') numero: string) {
    return this.ordenCompraService.atender(numero);
  }

  @Post(':numero/anular')
  public anular(@Param('numero') numero: string) {
    return this.ordenCompraService.anular(numero);
  }
}
