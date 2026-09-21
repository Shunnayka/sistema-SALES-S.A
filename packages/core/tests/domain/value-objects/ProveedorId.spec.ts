import { describe, it, expect } from 'vitest';
import { ProveedorId } from '../../../src/domain/value-objects/ProveedorId';

describe('ProveedorId', () => {
  it('creates a valid id trimming surrounding whitespace', () => {
    const id = ProveedorId.create('  PR001  ');

    expect(id.getValue()).toBe('PR001');
  });

  it('throws when the value is empty', () => {
    expect(() => ProveedorId.create('')).toThrow('ProveedorId cannot be empty');
  });

  it('throws when the value exceeds 10 characters', () => {
    expect(() => ProveedorId.create('PR0000000001')).toThrow('ProveedorId cannot exceed 10 characters');
  });
});
