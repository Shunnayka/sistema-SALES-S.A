import { describe, it, expect } from 'vitest';
import { ClienteId } from '../../../src/domain/value-objects/ClienteId';

describe('ClienteId', () => {
  it('creates a valid id trimming surrounding whitespace', () => {
    const id = ClienteId.create('  C001  ');

    expect(id.getValue()).toBe('C001');
  });

  it('throws when the value is empty', () => {
    expect(() => ClienteId.create('')).toThrow('ClienteId cannot be empty');
  });

  it('throws when the value exceeds 10 characters', () => {
    expect(() => ClienteId.create('C0000000001')).toThrow('ClienteId cannot exceed 10 characters');
  });
});
