import { Producto } from '../../domain/entities/Producto';
import { ProductoId } from '../../domain/value-objects/ProductoId';

export interface ProductoRepositoryPort {
  buscarPorId(id: ProductoId): Promise<Producto | null>;
  guardar(producto: Producto): Promise<void>;
}
