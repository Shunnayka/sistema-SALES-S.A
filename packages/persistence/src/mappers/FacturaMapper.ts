import type { Factura as PrismaFactura, DetalleFactura as PrismaDetalleFactura } from '@prisma/client';
import { Factura, DetalleFactura, NumeroFactura, ClienteId, VendedorId, DetalleFacturaId, EstadoFactura } from '@sistema-sales/core';

type PrismaFacturaWithDetalles = PrismaFactura & { detalles: PrismaDetalleFactura[] };

export class FacturaMapper {
  public static toDomain(row: PrismaFacturaWithDetalles): Factura {
    const detalles = row.detalles.map((detalle) =>
      DetalleFactura.create({
        id: DetalleFacturaId.create(detalle.numeroFactura, detalle.idProducto),
        cantidad: detalle.cantidad,
        precioVenta: Number(detalle.precioVenta),
      }),
    );

    return Factura.create({
      numeroFactura: NumeroFactura.create(row.numeroFactura),
      fechaRegistro: row.fechaRegistro,
      idCliente: ClienteId.create(row.idCliente),
      idVendedor: VendedorId.create(row.idVendedor),
      porcentajeIva: Number(row.porcentajeIva),
      estado: row.estado as EstadoFactura,
      fechaCancelacion: row.fechaCancelacion,
      detalles,
    });
  }

  public static toPersistence(factura: Factura) {
    return {
      numeroFactura: factura.getNumeroFactura().getValue(),
      fechaRegistro: factura.getFechaRegistro(),
      idCliente: factura.getIdCliente().getValue(),
      idVendedor: factura.getIdVendedor().getValue(),
      porcentajeIva: factura.getPorcentajeIva(),
      estado: factura.getEstado(),
      fechaCancelacion: factura.getFechaCancelacion(),
    };
  }

  public static detallesToPersistence(factura: Factura) {
    return factura.getDetalles().map((detalle) => ({
      idProducto: detalle.getId().getIdProducto(),
      cantidad: detalle.getCantidad(),
      precioVenta: detalle.getPrecioVenta(),
    }));
  }
}
