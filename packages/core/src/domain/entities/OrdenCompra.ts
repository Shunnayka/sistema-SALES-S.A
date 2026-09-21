import { NumeroOrden } from '../value-objects/NumeroOrden';
import { ProveedorId } from '../value-objects/ProveedorId';
import { DetalleOrdenCompra } from './DetalleOrdenCompra';

export type EstadoOrdenCompra = 'pendiente' | 'atendida' | 'anulada';

export interface OrdenCompraProps {
  numeroOrden: NumeroOrden;
  fechaRegistro: Date;
  idProveedor: ProveedorId;
  estado?: EstadoOrdenCompra;
  fechaAtencion?: Date | null;
  detalles?: DetalleOrdenCompra[];
}

export class OrdenCompra {
  private readonly numeroOrden: NumeroOrden;
  private readonly fechaRegistro: Date;
  private readonly idProveedor: ProveedorId;
  private estado: EstadoOrdenCompra;
  private fechaAtencion: Date | null;
  private readonly detalles: DetalleOrdenCompra[];

  private constructor(
    props: Omit<OrdenCompraProps, 'estado' | 'fechaAtencion' | 'detalles'> & {
      estado: EstadoOrdenCompra;
      fechaAtencion: Date | null;
      detalles: DetalleOrdenCompra[];
    },
  ) {
    this.numeroOrden = props.numeroOrden;
    this.fechaRegistro = props.fechaRegistro;
    this.idProveedor = props.idProveedor;
    this.estado = props.estado;
    this.fechaAtencion = props.fechaAtencion;
    this.detalles = props.detalles;
  }

  public static create(props: OrdenCompraProps): OrdenCompra {
    const estado = props.estado ?? 'pendiente';

    if (estado !== 'pendiente' && estado !== 'atendida' && estado !== 'anulada') {
      throw new Error('OrdenCompra estado must be pendiente, atendida or anulada');
    }

    return new OrdenCompra({
      numeroOrden: props.numeroOrden,
      fechaRegistro: props.fechaRegistro,
      idProveedor: props.idProveedor,
      estado,
      fechaAtencion: props.fechaAtencion ?? null,
      detalles: props.detalles ?? [],
    });
  }

  public agregarDetalle(detalle: DetalleOrdenCompra): void {
    this.detalles.push(detalle);
  }

  public atender(fechaAtencion: Date): void {
    if (this.estado !== 'pendiente') {
      throw new Error('Only a pendiente orden can be atendida');
    }

    this.estado = 'atendida';
    this.fechaAtencion = fechaAtencion;
  }

  public anular(): void {
    if (this.estado === 'atendida') {
      throw new Error('An atendida orden cannot be anulada');
    }

    this.estado = 'anulada';
  }

  public getNumeroOrden(): NumeroOrden {
    return this.numeroOrden;
  }

  public getFechaRegistro(): Date {
    return this.fechaRegistro;
  }

  public getIdProveedor(): ProveedorId {
    return this.idProveedor;
  }

  public getEstado(): EstadoOrdenCompra {
    return this.estado;
  }

  public getFechaAtencion(): Date | null {
    return this.fechaAtencion;
  }

  public getDetalles(): DetalleOrdenCompra[] {
    return [...this.detalles];
  }
}
