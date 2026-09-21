import { Identifier } from './Identifier';

const MAX_LENGTH = 10;

export class ProductoId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ProductoId {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('ProductoId cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`ProductoId cannot exceed ${MAX_LENGTH} characters`);
    }

    return new ProductoId(trimmed);
  }
}
