import { Identifier } from './Identifier';

const MAX_LENGTH = 15;

export class NumeroFactura extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): NumeroFactura {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('NumeroFactura cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`NumeroFactura cannot exceed ${MAX_LENGTH} characters`);
    }

    return new NumeroFactura(trimmed);
  }
}
