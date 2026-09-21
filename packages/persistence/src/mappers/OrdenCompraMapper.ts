import type { OrdenCompra as PrismaOrdenCompra, DetalleOrdenCompra as PrismaDetalleOrdenCompra } from '@prisma/client';
import { OrdenCompra, DetalleOrdenCompra, NumeroOrden, ProveedorId, DetalleOrdenCompraId, EstadoOrdenCompra } from '@sistema-sales/core';

type PrismaOrdenCompraWithDetalles = PrismaOrdenCompra & { detalles: PrismaDetalleOrdenCompra[] };

export class OrdenCompraMapper {
  public static toDomain(row: PrismaOrdenCompraWithDetalles): OrdenCompra {
    const detalles = row.detalles.map((detalle) =>
      DetalleOrdenCompra.create({
        id: DetalleOrdenCompraId.create(detalle.numeroOrden, detalle.idProducto),
        cantidadSolicitada: detalle.cantidadSolicitada,
      }),
    );

    return OrdenCompra.create({
      numeroOrden: NumeroOrden.create(row.numeroOrden),
      fechaRegistro: row.fechaRegistro,
      idProveedor: ProveedorId.create(row.idProveedor),
      estado: row.estado as EstadoOrdenCompra,
      fechaAtencion: row.fechaAtencion,
      detalles,
    });
  }

  public static toPersistence(orden: OrdenCompra) {
    return {
      numeroOrden: orden.getNumeroOrden().getValue(),
      fechaRegistro: orden.getFechaRegistro(),
      idProveedor: orden.getIdProveedor().getValue(),
      estado: orden.getEstado(),
      fechaAtencion: orden.getFechaAtencion(),
    };
  }

  public static detallesToPersistence(orden: OrdenCompra) {
    return orden.getDetalles().map((detalle) => ({
      idProducto: detalle.getId().getIdProducto(),
      cantidadSolicitada: detalle.getCantidadSolicitada(),
    }));
  }
}
