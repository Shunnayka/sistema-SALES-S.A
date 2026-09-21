import { DistritoId } from '../value-objects/DistritoId';

export interface DistritoProps {
  id: DistritoId;
  descripcion: string;
}

export class Distrito {
  private readonly id: DistritoId;
  private descripcion: string;

  private constructor(props: DistritoProps) {
    this.id = props.id;
    this.descripcion = props.descripcion;
  }

  public static create(props: DistritoProps): Distrito {
    if (!props.descripcion?.trim()) {
      throw new Error('Distrito descripcion cannot be empty');
    }
    if (props.descripcion.length > 100) {
      throw new Error('Distrito descripcion cannot exceed 100 characters');
    }

    return new Distrito(props);
  }

  public getId(): DistritoId {
    return this.id;
  }

  public getDescripcion(): string {
    return this.descripcion;
  }
}
