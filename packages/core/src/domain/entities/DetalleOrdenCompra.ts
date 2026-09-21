import { DetalleOrdenCompraId } from '../value-objects/DetalleOrdenCompraId';

export interface DetalleOrdenCompraProps {
  id: DetalleOrdenCompraId;
  cantidadSolicitada: number;
}

export class DetalleOrdenCompra {
  private readonly id: DetalleOrdenCompraId;
  private cantidadSolicitada: number;

  private constructor(props: DetalleOrdenCompraProps) {
    this.id = props.id;
    this.cantidadSolicitada = props.cantidadSolicitada;
  }

  public static create(props: DetalleOrdenCompraProps): DetalleOrdenCompra {
    if (!Number.isInteger(props.cantidadSolicitada) || props.cantidadSolicitada <= 0) {
      throw new Error('DetalleOrdenCompra cantidadSolicitada must be an integer greater than zero');
    }

    return new DetalleOrdenCompra(props);
  }

  public getId(): DetalleOrdenCompraId {
    return this.id;
  }

  public getCantidadSolicitada(): number {
    return this.cantidadSolicitada;
  }
}
