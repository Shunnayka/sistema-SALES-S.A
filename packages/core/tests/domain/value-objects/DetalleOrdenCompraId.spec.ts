import { describe, it, expect } from 'vitest';
import { DetalleOrdenCompraId } from '../../../src/domain/value-objects/DetalleOrdenCompraId';

describe('DetalleOrdenCompraId', () => {
  it('creates a valid composite id', () => {
    const id = DetalleOrdenCompraId.create('OC-0001', 'P001');

    expect(id.getNumeroOrden()).toBe('OC-0001');
    expect(id.getIdProducto()).toBe('P001');
  });

  it('throws when numeroOrden is empty', () => {
    expect(() => DetalleOrdenCompraId.create('', 'P001')).toThrow('DetalleOrdenCompraId numeroOrden cannot be empty');
  });

  it('throws when idProducto is empty', () => {
    expect(() => DetalleOrdenCompraId.create('OC-0001', '')).toThrow('DetalleOrdenCompraId idProducto cannot be empty');
  });

  it('considers two ids with the same parts equal', () => {
    const a = DetalleOrdenCompraId.create('OC-0001', 'P001');
    const b = DetalleOrdenCompraId.create('OC-0001', 'P001');

    expect(a.equals(b)).toBe(true);
  });
});
