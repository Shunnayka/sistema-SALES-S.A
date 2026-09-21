import { describe, it, expect } from 'vitest';
import { VendedorId } from '../../../src/domain/value-objects/VendedorId';

describe('VendedorId', () => {
  it('creates a valid id trimming surrounding whitespace', () => {
    const id = VendedorId.create('  V001  ');

    expect(id.getValue()).toBe('V001');
  });

  it('throws when the value is empty', () => {
    expect(() => VendedorId.create('')).toThrow('VendedorId cannot be empty');
  });

  it('throws when the value exceeds 10 characters', () => {
    expect(() => VendedorId.create('V0000000001')).toThrow('VendedorId cannot exceed 10 characters');
  });
});
