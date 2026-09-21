import { Identifier } from './Identifier';

const MAX_LENGTH = 10;

export class DistritoId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): DistritoId {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('DistritoId cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`DistritoId cannot exceed ${MAX_LENGTH} characters`);
    }

    return new DistritoId(trimmed);
  }
}
