const MAX_NUMERO_ORDEN_LENGTH = 15;
const MAX_ID_PRODUCTO_LENGTH = 10;

export class DetalleOrdenCompraId {
  private readonly numeroOrden: string;
  private readonly idProducto: string;

  private constructor(numeroOrden: string, idProducto: string) {
    this.numeroOrden = numeroOrden;
    this.idProducto = idProducto;
  }

  public static create(numeroOrden: string, idProducto: string): DetalleOrdenCompraId {
    const trimmedNumeroOrden = numeroOrden?.trim();
    const trimmedIdProducto = idProducto?.trim();

    if (!trimmedNumeroOrden) {
      throw new Error('DetalleOrdenCompraId numeroOrden cannot be empty');
    }

    if (trimmedNumeroOrden.length > MAX_NUMERO_ORDEN_LENGTH) {
      throw new Error(`DetalleOrdenCompraId numeroOrden cannot exceed ${MAX_NUMERO_ORDEN_LENGTH} characters`);
    }

    if (!trimmedIdProducto) {
      throw new Error('DetalleOrdenCompraId idProducto cannot be empty');
    }

    if (trimmedIdProducto.length > MAX_ID_PRODUCTO_LENGTH) {
      throw new Error(`DetalleOrdenCompraId idProducto cannot exceed ${MAX_ID_PRODUCTO_LENGTH} characters`);
    }

    return new DetalleOrdenCompraId(trimmedNumeroOrden, trimmedIdProducto);
  }

  public getNumeroOrden(): string {
    return this.numeroOrden;
  }

  public getIdProducto(): string {
    return this.idProducto;
  }

  public equals(other?: DetalleOrdenCompraId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.numeroOrden === other.numeroOrden && this.idProducto === other.idProducto;
  }

  public toString(): string {
    return `${this.numeroOrden}:${this.idProducto}`;
  }
}
