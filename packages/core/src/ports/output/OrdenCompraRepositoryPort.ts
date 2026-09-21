import { OrdenCompra } from '../../domain/entities/OrdenCompra';

export interface OrdenCompraRepositoryPort {
  guardar(orden: OrdenCompra): Promise<void>;
}
