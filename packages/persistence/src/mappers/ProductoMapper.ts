import type { Producto as PrismaProducto } from '@prisma/client';
import { Producto, ProductoId } from '@sistema-sales/core';

export class ProductoMapper {
  public static toDomain(row: PrismaProducto): Producto {
    return Producto.create({
      id: ProductoId.create(row.idProducto),
      descripcion: row.descripcion,
      precio: Number(row.precio),
      stockActual: row.stockActual,
      stockMinimo: row.stockMinimo,
      marca: row.marca,
      lineaProducto: row.lineaProducto,
      esImportado: row.esImportado,
    });
  }

  public static toPersistence(producto: Producto) {
    return {
      idProducto: producto.getId().getValue(),
      descripcion: producto.getDescripcion(),
      precio: producto.getPrecio(),
      stockActual: producto.getStockActual(),
      stockMinimo: producto.getStockMinimo(),
      marca: producto.getMarca(),
      lineaProducto: producto.getLineaProducto(),
      esImportado: producto.getEsImportado(),
    };
  }
}
