import { OrdenCompra } from '../../domain/entities/OrdenCompra';

export interface DetalleOrdenCompraInput {
  idProducto: string;
  cantidadSolicitada: number;
}

export interface GestionarAbastecimientoInput {
  numeroOrden: string;
  idProveedor: string;
  detalles: DetalleOrdenCompraInput[];
}

export interface GestionarAbastecimientoUseCase {
  ejecutar(datosOrden: GestionarAbastecimientoInput): Promise<OrdenCompra>;
}
