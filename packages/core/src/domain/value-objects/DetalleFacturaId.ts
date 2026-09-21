const MAX_NUMERO_FACTURA_LENGTH = 15;
const MAX_ID_PRODUCTO_LENGTH = 10;

export class DetalleFacturaId {
  private readonly numeroFactura: string;
  private readonly idProducto: string;

  private constructor(numeroFactura: string, idProducto: string) {
    this.numeroFactura = numeroFactura;
    this.idProducto = idProducto;
  }

  public static create(numeroFactura: string, idProducto: string): DetalleFacturaId {
    const trimmedNumeroFactura = numeroFactura?.trim();
    const trimmedIdProducto = idProducto?.trim();

    if (!trimmedNumeroFactura) {
      throw new Error('DetalleFacturaId numeroFactura cannot be empty');
    }

    if (trimmedNumeroFactura.length > MAX_NUMERO_FACTURA_LENGTH) {
      throw new Error(`DetalleFacturaId numeroFactura cannot exceed ${MAX_NUMERO_FACTURA_LENGTH} characters`);
    }

    if (!trimmedIdProducto) {
      throw new Error('DetalleFacturaId idProducto cannot be empty');
    }

    if (trimmedIdProducto.length > MAX_ID_PRODUCTO_LENGTH) {
      throw new Error(`DetalleFacturaId idProducto cannot exceed ${MAX_ID_PRODUCTO_LENGTH} characters`);
    }

    return new DetalleFacturaId(trimmedNumeroFactura, trimmedIdProducto);
  }

  public getNumeroFactura(): string {
    return this.numeroFactura;
  }

  public getIdProducto(): string {
    return this.idProducto;
  }

  public equals(other?: DetalleFacturaId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.numeroFactura === other.numeroFactura && this.idProducto === other.idProducto;
  }

  public toString(): string {
    return `${this.numeroFactura}:${this.idProducto}`;
  }
}
