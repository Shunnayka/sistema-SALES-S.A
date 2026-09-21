import { VendedorId } from '../value-objects/VendedorId';
import { DistritoId } from '../value-objects/DistritoId';

export interface VendedorProps {
  id: VendedorId;
  nombres: string;
  apellidos: string;
  sueldo: number;
  fechaInicio: Date;
  idDistrito: DistritoId;
  tipoVendedor: string;
}

export class Vendedor {
  private readonly id: VendedorId;
  private nombres: string;
  private apellidos: string;
  private sueldo: number;
  private readonly fechaInicio: Date;
  private idDistrito: DistritoId;
  private tipoVendedor: string;

  private constructor(props: VendedorProps) {
    this.id = props.id;
    this.nombres = props.nombres;
    this.apellidos = props.apellidos;
    this.sueldo = props.sueldo;
    this.fechaInicio = props.fechaInicio;
    this.idDistrito = props.idDistrito;
    this.tipoVendedor = props.tipoVendedor;
  }

  public static create(props: VendedorProps): Vendedor {
    if (!props.nombres?.trim()) {
      throw new Error('Vendedor nombres cannot be empty');
    }
    if (props.nombres.length > 80) {
      throw new Error('Vendedor nombres cannot exceed 80 characters');
    }
    if (!props.apellidos?.trim()) {
      throw new Error('Vendedor apellidos cannot be empty');
    }
    if (props.apellidos.length > 80) {
      throw new Error('Vendedor apellidos cannot exceed 80 characters');
    }
    if (props.sueldo <= 0) {
      throw new Error('Vendedor sueldo must be greater than zero');
    }
    if (!props.tipoVendedor?.trim()) {
      throw new Error('Vendedor tipoVendedor cannot be empty');
    }
    if (props.tipoVendedor.length > 30) {
      throw new Error('Vendedor tipoVendedor cannot exceed 30 characters');
    }

    return new Vendedor(props);
  }

  public getId(): VendedorId {
    return this.id;
  }

  public getNombres(): string {
    return this.nombres;
  }

  public getApellidos(): string {
    return this.apellidos;
  }

  public getSueldo(): number {
    return this.sueldo;
  }

  public getFechaInicio(): Date {
    return this.fechaInicio;
  }

  public getIdDistrito(): DistritoId {
    return this.idDistrito;
  }

  public getTipoVendedor(): string {
    return this.tipoVendedor;
  }
}
