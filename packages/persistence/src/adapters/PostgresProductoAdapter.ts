import { PrismaClient } from '@prisma/client';
import { Producto, ProductoId, ProductoRepositoryPort } from '@sistema-sales/core';
import { ProductoMapper } from '../mappers/ProductoMapper';

export class PostgresProductoAdapter implements ProductoRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}

  public async buscarPorId(id: ProductoId): Promise<Producto | null> {
    const row = await this.prisma.producto.findUnique({
      where: { idProducto: id.getValue() },
    });

    return row ? ProductoMapper.toDomain(row) : null;
  }

  public async guardar(producto: Producto): Promise<void> {
    const data = ProductoMapper.toPersistence(producto);

    await this.prisma.producto.upsert({
      where: { idProducto: data.idProducto },
      create: data,
      update: data,
    });
  }
}
