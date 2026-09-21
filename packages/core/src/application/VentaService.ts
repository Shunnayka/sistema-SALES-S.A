import { RegistrarVentaUseCase, RegistrarVentaInput } from '../ports/input/RegistrarVentaUseCase';
import { ProductoRepositoryPort } from '../ports/output/ProductoRepositoryPort';
import { FacturaRepositoryPort } from '../ports/output/FacturaRepositoryPort';
import { Factura } from '../domain/entities/Factura';
import { DetalleFactura } from '../domain/entities/DetalleFactura';
import { NumeroFactura } from '../domain/value-objects/NumeroFactura';
import { ClienteId } from '../domain/value-objects/ClienteId';
import { VendedorId } from '../domain/value-objects/VendedorId';
import { ProductoId } from '../domain/value-objects/ProductoId';
import { DetalleFacturaId } from '../domain/value-objects/DetalleFacturaId';

export class VentaService implements RegistrarVentaUseCase {
  constructor(
    private readonly productoRepository: ProductoRepositoryPort,
    private readonly facturaRepository: FacturaRepositoryPort,
  ) {}

  public async ejecutar(datosFactura: RegistrarVentaInput): Promise<Factura> {
    const detalles: DetalleFactura[] = [];

    for (const detalleInput of datosFactura.detalles) {
      const productoId = ProductoId.create(detalleInput.idProducto);
      const producto = await this.productoRepository.buscarPorId(productoId);

      if (!producto) {
        throw new Error(`Producto ${detalleInput.idProducto} not found`);
      }

      producto.actualizarStock(-detalleInput.cantidad);
      await this.productoRepository.guardar(producto);

      const detalle = DetalleFactura.create({
        id: DetalleFacturaId.create(datosFactura.numeroFactura, detalleInput.idProducto),
        cantidad: detalleInput.cantidad,
        precioVenta: detalleInput.precioVenta,
      });

      detalles.push(detalle);
    }

    const factura = Factura.create({
      numeroFactura: NumeroFactura.create(datosFactura.numeroFactura),
      fechaRegistro: new Date(),
      idCliente: ClienteId.create(datosFactura.idCliente),
      idVendedor: VendedorId.create(datosFactura.idVendedor),
      porcentajeIva: datosFactura.porcentajeIva,
      detalles,
    });

    await this.facturaRepository.guardar(factura);

    return factura;
  }
}
