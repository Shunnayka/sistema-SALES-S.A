import { describe, it, expect } from 'vitest';
import { NumeroOrden } from '../../../src/domain/value-objects/NumeroOrden';

describe('NumeroOrden', () => {
  it('creates a valid numero trimming surrounding whitespace', () => {
    const numero = NumeroOrden.create('  OC-0001  ');

    expect(numero.getValue()).toBe('OC-0001');
  });

  it('throws when the value is empty', () => {
    expect(() => NumeroOrden.create('')).toThrow('NumeroOrden cannot be empty');
  });

  it('throws when the value exceeds 15 characters', () => {
    expect(() => NumeroOrden.create('OC-000000000000001')).toThrow('NumeroOrden cannot exceed 15 characters');
  });
});
