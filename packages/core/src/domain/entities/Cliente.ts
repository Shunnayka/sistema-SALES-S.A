import { ClienteId } from '../value-objects/ClienteId';
import { DistritoId } from '../value-objects/DistritoId';

export type CondicionCliente = 'activo' | 'inactivo';

export interface ClienteProps {
  id: ClienteId;
  nombreRazonSocial: string;
  direccion: string;
  telefono: string;
  ruc: string;
  idDistrito: DistritoId;
  fechaRegistro: Date;
  tipoCliente: string;
  condicionCliente: CondicionCliente;
}

export class Cliente {
  private readonly id: ClienteId;
  private nombreRazonSocial: string;
  private direccion: string;
  private telefono: string;
  private readonly ruc: string;
  private idDistrito: DistritoId;
  private readonly fechaRegistro: Date;
  private tipoCliente: string;
  private condicionCliente: CondicionCliente;

  private constructor(props: ClienteProps) {
    this.id = props.id;
    this.nombreRazonSocial = props.nombreRazonSocial;
    this.direccion = props.direccion;
    this.telefono = props.telefono;
    this.ruc = props.ruc;
    this.idDistrito = props.idDistrito;
    this.fechaRegistro = props.fechaRegistro;
    this.tipoCliente = props.tipoCliente;
    this.condicionCliente = props.condicionCliente;
  }

  public static create(props: ClienteProps): Cliente {
    if (!props.nombreRazonSocial?.trim()) {
      throw new Error('Cliente nombreRazonSocial cannot be empty');
    }
    if (props.nombreRazonSocial.length > 150) {
      throw new Error('Cliente nombreRazonSocial cannot exceed 150 characters');
    }
    if (!props.direccion?.trim()) {
      throw new Error('Cliente direccion cannot be empty');
    }
    if (props.direccion.length > 200) {
      throw new Error('Cliente direccion cannot exceed 200 characters');
    }
    if (!props.telefono?.trim()) {
      throw new Error('Cliente telefono cannot be empty');
    }
    if (props.telefono.length > 15) {
      throw new Error('Cliente telefono cannot exceed 15 characters');
    }
    if (!/^\d{13}$/.test(props.ruc)) {
      throw new Error('Cliente ruc must be exactly 13 digits');
    }
    if (!props.tipoCliente?.trim()) {
      throw new Error('Cliente tipoCliente cannot be empty');
    }
    if (props.tipoCliente.length > 30) {
      throw new Error('Cliente tipoCliente cannot exceed 30 characters');
    }
    if (props.condicionCliente !== 'activo' && props.condicionCliente !== 'inactivo') {
      throw new Error('Cliente condicionCliente must be activo or inactivo');
    }

    return new Cliente(props);
  }

  public activar(): void {
    this.condicionCliente = 'activo';
  }

  public desactivar(): void {
    this.condicionCliente = 'inactivo';
  }

  public getId(): ClienteId {
    return this.id;
  }

  public getNombreRazonSocial(): string {
    return this.nombreRazonSocial;
  }

  public getDireccion(): string {
    return this.direccion;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public getRuc(): string {
    return this.ruc;
  }

  public getIdDistrito(): DistritoId {
    return this.idDistrito;
  }

  public getFechaRegistro(): Date {
    return this.fechaRegistro;
  }

  public getTipoCliente(): string {
    return this.tipoCliente;
  }

  public getCondicionCliente(): CondicionCliente {
    return this.condicionCliente;
  }

  public toJSON() {
    return {
      idCliente: this.id.getValue(),
      nombreRazonSocial: this.nombreRazonSocial,
      direccion: this.direccion,
      telefono: this.telefono,
      ruc: this.ruc,
      idDistrito: this.idDistrito.getValue(),
      fechaRegistro: this.fechaRegistro,
      tipoCliente: this.tipoCliente,
      condicionCliente: this.condicionCliente,
    };
  }
}
