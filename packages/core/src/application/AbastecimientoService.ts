import { GestionarAbastecimientoUseCase, GestionarAbastecimientoInput } from '../ports/input/GestionarAbastecimientoUseCase';
import { OrdenCompraRepositoryPort } from '../ports/output/OrdenCompraRepositoryPort';
import { ProductoRepositoryPort } from '../ports/output/ProductoRepositoryPort';
import { OrdenCompra } from '../domain/entities/OrdenCompra';
import { DetalleOrdenCompra } from '../domain/entities/DetalleOrdenCompra';
import { NumeroOrden } from '../domain/value-objects/NumeroOrden';
import { ProveedorId } from '../domain/value-objects/ProveedorId';
import { ProductoId } from '../domain/value-objects/ProductoId';
import { DetalleOrdenCompraId } from '../domain/value-objects/DetalleOrdenCompraId';

export class AbastecimientoService implements GestionarAbastecimientoUseCase {
  constructor(
    private readonly ordenCompraRepository: OrdenCompraRepositoryPort,
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  public async ejecutar(datosOrden: GestionarAbastecimientoInput): Promise<OrdenCompra> {
    const detalles: DetalleOrdenCompra[] = [];

    for (const detalleInput of datosOrden.detalles) {
      const productoId = ProductoId.create(detalleInput.idProducto);
      const producto = await this.productoRepository.buscarPorId(productoId);

      if (!producto) {
        throw new Error(`Producto ${detalleInput.idProducto} not found`);
      }

      const detalle = DetalleOrdenCompra.create({
        id: DetalleOrdenCompraId.create(datosOrden.numeroOrden, detalleInput.idProducto),
        cantidadSolicitada: detalleInput.cantidadSolicitada,
      });

      detalles.push(detalle);
    }

    const orden = OrdenCompra.create({
      numeroOrden: NumeroOrden.create(datosOrden.numeroOrden),
      fechaRegistro: new Date(),
      idProveedor: ProveedorId.create(datosOrden.idProveedor),
      detalles,
    });

    await this.ordenCompraRepository.guardar(orden);

    return orden;
  }
}
