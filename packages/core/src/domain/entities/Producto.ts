import { ProductoId } from '../value-objects/ProductoId';

export interface ProductoProps {
  id: ProductoId;
  descripcion: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  marca: string;
  lineaProducto: string;
  esImportado: boolean;
}

export class Producto {
  private readonly id: ProductoId;
  private descripcion: string;
  private precio: number;
  private stockActual: number;
  private stockMinimo: number;
  private marca: string;
  private lineaProducto: string;
  private esImportado: boolean;

  private constructor(props: ProductoProps) {
    this.id = props.id;
    this.descripcion = props.descripcion;
    this.precio = props.precio;
    this.stockActual = props.stockActual;
    this.stockMinimo = props.stockMinimo;
    this.marca = props.marca;
    this.lineaProducto = props.lineaProducto;
    this.esImportado = props.esImportado;
  }

  public static create(props: ProductoProps): Producto {
    if (!props.descripcion?.trim()) {
      throw new Error('Producto descripcion cannot be empty');
    }
    if (props.descripcion.length > 200) {
      throw new Error('Producto descripcion cannot exceed 200 characters');
    }
    if (props.precio < 0) {
      throw new Error('Producto precio cannot be negative');
    }
    if (props.stockActual < 0) {
      throw new Error('Producto stockActual cannot be negative');
    }
    if (props.stockMinimo < 0) {
      throw new Error('Producto stockMinimo cannot be negative');
    }
    if (!props.marca?.trim()) {
      throw new Error('Producto marca cannot be empty');
    }
    if (props.marca.length > 60) {
      throw new Error('Producto marca cannot exceed 60 characters');
    }
    if (!props.lineaProducto?.trim()) {
      throw new Error('Producto lineaProducto cannot be empty');
    }
    if (props.lineaProducto.length > 60) {
      throw new Error('Producto lineaProducto cannot exceed 60 characters');
    }

    return new Producto(props);
  }

  public necesitaReabastecimiento(): boolean {
    return this.stockActual <= this.stockMinimo;
  }

  public actualizarStock(cantidad: number): void {
    const nuevoStock = this.stockActual + cantidad;

    if (nuevoStock < 0) {
      throw new Error('Producto stock cannot become negative');
    }

    this.stockActual = nuevoStock;
  }

  public getId(): ProductoId {
    return this.id;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }

  public getPrecio(): number {
    return this.precio;
  }

  public getStockActual(): number {
    return this.stockActual;
  }

  public getStockMinimo(): number {
    return this.stockMinimo;
  }

  public getMarca(): string {
    return this.marca;
  }

  public getLineaProducto(): string {
    return this.lineaProducto;
  }

  public getEsImportado(): boolean {
    return this.esImportado;
  }

  public toJSON() {
    return {
      idProducto: this.id.getValue(),
      descripcion: this.descripcion,
      precio: this.precio,
      stockActual: this.stockActual,
      stockMinimo: this.stockMinimo,
      marca: this.marca,
      lineaProducto: this.lineaProducto,
      esImportado: this.esImportado,
    };
  }
}
