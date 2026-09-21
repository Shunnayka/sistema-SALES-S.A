import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { AbastecimientoService } from '@sistema-sales/core';
import { OrdenCompraMapper, PostgresOrdenCompraAdapter, PostgresProductoAdapter } from '@sistema-sales/persistence';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { RegistrarOrdenDto } from './dto/registrar-orden.dto';

@Injectable()
export class OrdenCompraService {
  private readonly ordenCompraRepository: PostgresOrdenCompraAdapter;
  private readonly abastecimientoService: AbastecimientoService;

  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {
    const productoRepository = new PostgresProductoAdapter(prisma);
    this.ordenCompraRepository = new PostgresOrdenCompraAdapter(prisma);
    this.abastecimientoService = new AbastecimientoService(this.ordenCompraRepository, productoRepository);
  }

  public async findAll() {
    const rows = await this.prisma.ordenCompra.findMany({
      include: { detalles: true },
      orderBy: { numeroOrden: 'asc' },
    });

    return rows.map((row) => OrdenCompraMapper.toDomain(row));
  }

  public async findOne(numeroOrden: string) {
    const row = await this.prisma.ordenCompra.findUnique({
      where: { numeroOrden },
      include: { detalles: true },
    });

    if (!row) {
      throw new NotFoundException(`OrdenCompra ${numeroOrden} not found`);
    }

    return OrdenCompraMapper.toDomain(row);
  }

  public registrarOrden(dto: RegistrarOrdenDto) {
    return this.abastecimientoService.ejecutar(dto);
  }

  public async atender(numeroOrden: string) {
    const orden = await this.findOne(numeroOrden);
    orden.atender(new Date());
    await this.ordenCompraRepository.guardar(orden);

    return orden;
  }

  public async anular(numeroOrden: string) {
    const orden = await this.findOne(numeroOrden);
    orden.anular();
    await this.ordenCompraRepository.guardar(orden);

    return orden;
  }
}
