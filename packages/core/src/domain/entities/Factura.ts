import { NumeroFactura } from '../value-objects/NumeroFactura';
import { ClienteId } from '../value-objects/ClienteId';
import { VendedorId } from '../value-objects/VendedorId';
import { DetalleFactura } from './DetalleFactura';

export type EstadoFactura = 'pendiente' | 'cancelada' | 'anulada';

export interface FacturaProps {
  numeroFactura: NumeroFactura;
  fechaRegistro: Date;
  idCliente: ClienteId;
  idVendedor: VendedorId;
  porcentajeIva: number;
  estado?: EstadoFactura;
  fechaCancelacion?: Date | null;
  detalles?: DetalleFactura[];
}

export class Factura {
  private readonly numeroFactura: NumeroFactura;
  private readonly fechaRegistro: Date;
  private readonly idCliente: ClienteId;
  private readonly idVendedor: VendedorId;
  private readonly porcentajeIva: number;
  private estado: EstadoFactura;
  private fechaCancelacion: Date | null;
  private readonly detalles: DetalleFactura[];

  private constructor(
    props: Omit<FacturaProps, 'estado' | 'fechaCancelacion' | 'detalles'> & {
      estado: EstadoFactura;
      fechaCancelacion: Date | null;
      detalles: DetalleFactura[];
    },
  ) {
    this.numeroFactura = props.numeroFactura;
    this.fechaRegistro = props.fechaRegistro;
    this.idCliente = props.idCliente;
    this.idVendedor = props.idVendedor;
    this.porcentajeIva = props.porcentajeIva;
    this.estado = props.estado;
    this.fechaCancelacion = props.fechaCancelacion;
    this.detalles = props.detalles;
  }

  public static create(props: FacturaProps): Factura {
    if (props.porcentajeIva < 0) {
      throw new Error('Factura porcentajeIva cannot be negative');
    }

    const estado = props.estado ?? 'pendiente';

    if (estado !== 'pendiente' && estado !== 'cancelada' && estado !== 'anulada') {
      throw new Error('Factura estado must be pendiente, cancelada or anulada');
    }

    return new Factura({
      numeroFactura: props.numeroFactura,
      fechaRegistro: props.fechaRegistro,
      idCliente: props.idCliente,
      idVendedor: props.idVendedor,
      porcentajeIva: props.porcentajeIva,
      estado,
      fechaCancelacion: props.fechaCancelacion ?? null,
      detalles: props.detalles ?? [],
    });
  }

  public agregarDetalle(detalle: DetalleFactura): void {
    this.detalles.push(detalle);
  }

  public calcularTotal(): number {
    const subtotal = this.detalles.reduce((acumulado, detalle) => acumulado + detalle.subtotal(), 0);
    const iva = subtotal * (this.porcentajeIva / 100);

    return subtotal + iva;
  }

  public cancelar(fechaCancelacion: Date): void {
    if (this.estado !== 'pendiente') {
      throw new Error('Only a pendiente factura can be cancelada');
    }

    this.estado = 'cancelada';
    this.fechaCancelacion = fechaCancelacion;
  }

  public anular(): void {
    if (this.estado === 'cancelada') {
      throw new Error('A cancelada factura cannot be anulada');
    }

    this.estado = 'anulada';
  }

  public getNumeroFactura(): NumeroFactura {
    return this.numeroFactura;
  }

  public getFechaRegistro(): Date {
    return this.fechaRegistro;
  }

  public getIdCliente(): ClienteId {
    return this.idCliente;
  }

  public getIdVendedor(): VendedorId {
    return this.idVendedor;
  }

  public getPorcentajeIva(): number {
    return this.porcentajeIva;
  }

  public getEstado(): EstadoFactura {
    return this.estado;
  }

  public getFechaCancelacion(): Date | null {
    return this.fechaCancelacion;
  }

  public getDetalles(): DetalleFactura[] {
    return [...this.detalles];
  }
}
