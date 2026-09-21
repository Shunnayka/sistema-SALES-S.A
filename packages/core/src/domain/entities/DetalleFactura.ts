import { DetalleFacturaId } from '../value-objects/DetalleFacturaId';

export interface DetalleFacturaProps {
  id: DetalleFacturaId;
  cantidad: number;
  precioVenta: number;
}

export class DetalleFactura {
  private readonly id: DetalleFacturaId;
  private cantidad: number;
  private precioVenta: number;

  private constructor(props: DetalleFacturaProps) {
    this.id = props.id;
    this.cantidad = props.cantidad;
    this.precioVenta = props.precioVenta;
  }

  public static create(props: DetalleFacturaProps): DetalleFactura {
    if (!Number.isInteger(props.cantidad) || props.cantidad <= 0) {
      throw new Error('DetalleFactura cantidad must be an integer greater than zero');
    }
    if (props.precioVenta < 0) {
      throw new Error('DetalleFactura precioVenta cannot be negative');
    }

    return new DetalleFactura(props);
  }

  public subtotal(): number {
    return this.cantidad * this.precioVenta;
  }

  public getId(): DetalleFacturaId {
    return this.id;
  }

  public getCantidad(): number {
    return this.cantidad;
  }

  public getPrecioVenta(): number {
    return this.precioVenta;
  }
}
