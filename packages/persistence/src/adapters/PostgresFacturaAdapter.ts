import { PrismaClient } from '@prisma/client';
import { Factura, FacturaRepositoryPort, NumeroFactura } from '@sistema-sales/core';
import { FacturaMapper } from '../mappers/FacturaMapper';

export class PostgresFacturaAdapter implements FacturaRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async guardar(factura: Factura): Promise<void> {
    const data = FacturaMapper.toPersistence(factura);
    const detalles = FacturaMapper.detallesToPersistence(factura);

    await this.prisma.$transaction(async (tx) => {
      await tx.factura.upsert({
        where: { numeroFactura: data.numeroFactura },
        create: data,
        update: data,
      });

      await tx.detalleFactura.deleteMany({ where: { numeroFactura: data.numeroFactura } });

      if (detalles.length > 0) {
        await tx.detalleFactura.createMany({
          data: detalles.map((detalle) => ({ ...detalle, numeroFactura: data.numeroFactura })),
        });
      }
    });
  }

  public async buscarPorNumero(numero: NumeroFactura): Promise<Factura | null> {
    const row = await this.prisma.factura.findUnique({
      where: { numeroFactura: numero.getValue() },
      include: { detalles: true },
    });

    return row ? FacturaMapper.toDomain(row) : null;
  }
}
