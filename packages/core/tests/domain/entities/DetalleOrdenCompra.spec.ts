import { describe, it, expect } from 'vitest';
import { DetalleOrdenCompra } from '../../../src/domain/entities/DetalleOrdenCompra';
import { DetalleOrdenCompraId } from '../../../src/domain/value-objects/DetalleOrdenCompraId';

describe('DetalleOrdenCompra', () => {
  it('creates a valid detalle', () => {
    const detalle = DetalleOrdenCompra.create({
      id: DetalleOrdenCompraId.create('OC-0001', 'P001'),
      cantidadSolicitada: 20,
    });

    expect(detalle.getCantidadSolicitada()).toBe(20);
  });

  it('throws when cantidadSolicitada is zero or negative', () => {
    expect(() =>
      DetalleOrdenCompra.create({
        id: DetalleOrdenCompraId.create('OC-0001', 'P001'),
        cantidadSolicitada: 0,
      }),
    ).toThrow('DetalleOrdenCompra cantidadSolicitada must be an integer greater than zero');
  });
});
