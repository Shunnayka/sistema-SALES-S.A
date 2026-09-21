import { ProductoId } from '../../domain/value-objects/ProductoId';

export interface GestionarInventarioUseCase {
  ejecutar(idProducto: ProductoId, cantidad: number): Promise<void>;
}
