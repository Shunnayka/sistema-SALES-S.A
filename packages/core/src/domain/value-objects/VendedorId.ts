import { Identifier } from './Identifier';

const MAX_LENGTH = 10;

export class VendedorId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): VendedorId {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('VendedorId cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`VendedorId cannot exceed ${MAX_LENGTH} characters`);
    }

    return new VendedorId(trimmed);
  }
}
