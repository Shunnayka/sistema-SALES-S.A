import { ProveedorId } from '../value-objects/ProveedorId';
import { DistritoId } from '../value-objects/DistritoId';

export interface ProveedorProps {
  id: ProveedorId;
  razonSocial: string;
  direccion: string;
  telefono: string;
  idDistrito: DistritoId;
  representanteLegal: string;
}

export class Proveedor {
  private readonly id: ProveedorId;
  private razonSocial: string;
  private direccion: string;
  private telefono: string;
  private idDistrito: DistritoId;
  private representanteLegal: string;

  private constructor(props: ProveedorProps) {
    this.id = props.id;
    this.razonSocial = props.razonSocial;
    this.direccion = props.direccion;
    this.telefono = props.telefono;
    this.idDistrito = props.idDistrito;
    this.representanteLegal = props.representanteLegal;
  }

  public static create(props: ProveedorProps): Proveedor {
    if (!props.razonSocial?.trim()) {
      throw new Error('Proveedor razonSocial cannot be empty');
    }
    if (props.razonSocial.length > 150) {
      throw new Error('Proveedor razonSocial cannot exceed 150 characters');
    }
    if (!props.direccion?.trim()) {
      throw new Error('Proveedor direccion cannot be empty');
    }
    if (props.direccion.length > 200) {
      throw new Error('Proveedor direccion cannot exceed 200 characters');
    }
    if (!props.telefono?.trim()) {
      throw new Error('Proveedor telefono cannot be empty');
    }
    if (props.telefono.length > 15) {
      throw new Error('Proveedor telefono cannot exceed 15 characters');
    }
    if (!props.representanteLegal?.trim()) {
      throw new Error('Proveedor representanteLegal cannot be empty');
    }
    if (props.representanteLegal.length > 120) {
      throw new Error('Proveedor representanteLegal cannot exceed 120 characters');
    }

    return new Proveedor(props);
  }

  public getId(): ProveedorId {
    return this.id;
  }

  public getRazonSocial(): string {
    return this.razonSocial;
  }

  public getDireccion(): string {
    return this.direccion;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public getIdDistrito(): DistritoId {
    return this.idDistrito;
  }

  public getRepresentanteLegal(): string {
    return this.representanteLegal;
  }
}
