import { Identifier } from './Identifier';

const MAX_LENGTH = 10;

export class ProveedorId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ProveedorId {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('ProveedorId cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`ProveedorId cannot exceed ${MAX_LENGTH} characters`);
    }

    return new ProveedorId(trimmed);
  }
}
