import { Factura } from '../../domain/entities/Factura';
import { NumeroFactura } from '../../domain/value-objects/NumeroFactura';

export interface FacturaRepositoryPort {
  guardar(factura: Factura): Promise<void>;
  buscarPorNumero(numero: NumeroFactura): Promise<Factura | null>;
}
