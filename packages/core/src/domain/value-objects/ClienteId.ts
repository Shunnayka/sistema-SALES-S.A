import { Identifier } from './Identifier';

const MAX_LENGTH = 10;

export class ClienteId extends Identifier<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): ClienteId {
    const trimmed = value?.trim();

    if (!trimmed) {
      throw new Error('ClienteId cannot be empty');
    }

    if (trimmed.length > MAX_LENGTH) {
      throw new Error(`ClienteId cannot exceed ${MAX_LENGTH} characters`);
    }

    return new ClienteId(trimmed);
  }
}
