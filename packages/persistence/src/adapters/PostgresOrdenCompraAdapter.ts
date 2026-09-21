import { PrismaClient } from '@prisma/client';
import { OrdenCompra, OrdenCompraRepositoryPort } from '@sistema-sales/core';
import { OrdenCompraMapper } from '../mappers/OrdenCompraMapper';

export class PostgresOrdenCompraAdapter implements OrdenCompraRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async guardar(orden: OrdenCompra): Promise<void> {
    const data = OrdenCompraMapper.toPersistence(orden);
    const detalles = OrdenCompraMapper.detallesToPersistence(orden);

    await this.prisma.$transaction(async (tx) => {
      await tx.ordenCompra.upsert({
        where: { numeroOrden: data.numeroOrden },
        create: data,
        update: data,
      });

      await tx.detalleOrdenCompra.deleteMany({ where: { numeroOrden: data.numeroOrden } });

      if (detalles.length > 0) {
        await tx.detalleOrdenCompra.createMany({
          data: detalles.map((detalle) => ({ ...detalle, numeroOrden: data.numeroOrden })),
        });
      }
    });
  }
}
