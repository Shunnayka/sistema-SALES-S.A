import { GestionarInventarioUseCase } from '../ports/input/GestionarInventarioUseCase';
import { ProductoRepositoryPort } from '../ports/output/ProductoRepositoryPort';
import { ProductoId } from '../domain/value-objects/ProductoId';

export class InventarioService implements GestionarInventarioUseCase {
  constructor(private readonly productoRepository: ProductoRepositoryPort) {}

  public async ejecutar(idProducto: ProductoId, cantidad: number): Promise<void> {
    const producto = await this.productoRepository.buscarPorId(idProducto);

    if (!producto) {
      throw new Error(`Producto ${idProducto.getValue()} not found`);
    }

    producto.actualizarStock(cantidad);

    await this.productoRepository.guardar(producto);
  }
}
