import { describe, it, expect } from 'vitest';
import { ProductoId } from '../../../src/domain/value-objects/ProductoId';

describe('ProductoId', () => {
  it('creates a valid id trimming surrounding whitespace', () => {
    const id = ProductoId.create('  P001  ');

    expect(id.getValue()).toBe('P001');
  });

  it('throws when the value is empty', () => {
    expect(() => ProductoId.create('   ')).toThrow('ProductoId cannot be empty');
  });

  it('throws when the value exceeds 10 characters', () => {
    expect(() => ProductoId.create('P0000000001')).toThrow('ProductoId cannot exceed 10 characters');
  });

  it('considers two ids with the same value equal', () => {
    const a = ProductoId.create('P001');
    const b = ProductoId.create('P001');

    expect(a.equals(b)).toBe(true);
  });

  it('considers two ids with different values not equal', () => {
    const a = ProductoId.create('P001');
    const b = ProductoId.create('P002');

    expect(a.equals(b)).toBe(false);
  });
});
