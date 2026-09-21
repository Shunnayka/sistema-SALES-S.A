import { Factura } from '../../domain/entities/Factura';

export interface DetalleFacturaInput {
  idProducto: string;
  cantidad: number;
  precioVenta: number;
}

export interface RegistrarVentaInput {
  numeroFactura: string;
  idCliente: string;
  idVendedor: string;
  porcentajeIva: number;
  detalles: DetalleFacturaInput[];
}

export interface RegistrarVentaUseCase {
  ejecutar(datosFactura: RegistrarVentaInput): Promise<Factura>;
}
