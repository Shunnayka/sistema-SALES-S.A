import { describe, it, expect } from 'vitest';
import { NumeroFactura } from '../../../src/domain/value-objects/NumeroFactura';

describe('NumeroFactura', () => {
  it('creates a valid numero trimming surrounding whitespace', () => {
    const numero = NumeroFactura.create('  F-0001  ');

    expect(numero.getValue()).toBe('F-0001');
  });

  it('throws when the value is empty', () => {
    expect(() => NumeroFactura.create('')).toThrow('NumeroFactura cannot be empty');
  });

  it('throws when the value exceeds 15 characters', () => {
    expect(() => NumeroFactura.create('F-000000000000001')).toThrow('NumeroFactura cannot exceed 15 characters');
  });
});
