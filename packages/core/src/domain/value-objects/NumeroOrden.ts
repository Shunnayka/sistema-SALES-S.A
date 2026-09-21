import { Identifier } from './Identifier';

const MAX_LENGTH = 15;

export class NumeroOrden extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): NumeroOrden {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('NumeroOrden cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`NumeroOrden cannot exceed ${MAX_LENGTH} characters`);
    }

    return new NumeroOrden(trimmed);
  }
}
