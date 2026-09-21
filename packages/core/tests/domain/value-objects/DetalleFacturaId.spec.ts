import { describe, it, expect } from 'vitest';
import { DetalleFacturaId } from '../../../src/domain/value-objects/DetalleFacturaId';

describe('DetalleFacturaId', () => {
  it('creates a valid composite id', () => {
    const id = DetalleFacturaId.create('F-0001', 'P001');

    expect(id.getNumeroFactura()).toBe('F-0001');
    expect(id.getIdProducto()).toBe('P001');
  });

  it('throws when numeroFactura is empty', () => {
    expect(() => DetalleFacturaId.create('', 'P001')).toThrow('DetalleFacturaId numeroFactura cannot be empty');
  });

  it('throws when idProducto is empty', () => {
    expect(() => DetalleFacturaId.create('F-0001', '')).toThrow('DetalleFacturaId idProducto cannot be empty');
  });

  it('considers two ids with the same parts equal', () => {
    const a = DetalleFacturaId.create('F-0001', 'P001');
    const b = DetalleFacturaId.create('F-0001', 'P001');

    expect(a.equals(b)).toBe(true);
  });

  it('considers two ids with different parts not equal', () => {
    const a = DetalleFacturaId.create('F-0001', 'P001');
    const b = DetalleFacturaId.create('F-0001', 'P002');

    expect(a.equals(b)).toBe(false);
  });
});
