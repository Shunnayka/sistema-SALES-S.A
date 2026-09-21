import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { NumeroFactura, VentaService } from '@sistema-sales/core';
import { FacturaMapper, PostgresFacturaAdapter, PostgresProductoAdapter } from '@sistema-sales/persistence';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';

@Injectable()
export class FacturaService {
  private readonly facturaRepository: PostgresFacturaAdapter;
  private readonly ventaService: VentaService;

  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {
    const productoRepository = new PostgresProductoAdapter(prisma);
    this.facturaRepository = new PostgresFacturaAdapter(prisma);
    this.ventaService = new VentaService(productoRepository, this.facturaRepository);
  }

  public async findAll() {
    const rows = await this.prisma.factura.findMany({
      include: { detalles: true },
      orderBy: { numeroFactura: 'asc' },
    });

    return rows.map((row) => FacturaMapper.toDomain(row));
  }

  public async findOne(numeroFactura: string) {
    const factura = await this.facturaRepository.buscarPorNumero(NumeroFactura.create(numeroFactura));

    if (!factura) {
      throw new NotFoundException(`Factura ${numeroFactura} not found`);
    }

    return factura;
  }

  public registrarVenta(dto: RegistrarVentaDto) {
    return this.ventaService.ejecutar(dto);
  }

  public async cancelar(numeroFactura: string) {
    const factura = await this.findOne(numeroFactura);
    factura.cancelar(new Date());
    await this.facturaRepository.guardar(factura);

    return factura;
  }

  public async anular(numeroFactura: string) {
    const factura = await this.findOne(numeroFactura);
    factura.anular();
    await this.facturaRepository.guardar(factura);

    return factura;
  }
}
