import { describe, it, expect } from 'vitest';
import { DetalleFactura } from '../../../src/domain/entities/DetalleFactura';
import { DetalleFacturaId } from '../../../src/domain/value-objects/DetalleFacturaId';

describe('DetalleFactura', () => {
  it('calculates the subtotal as cantidad times precioVenta', () => {
    const detalle = DetalleFactura.create({
      id: DetalleFacturaId.create('F-0001', 'P001'),
      cantidad: 3,
      precioVenta: 10.5,
    });

    expect(detalle.subtotal()).toBe(31.5);
  });

  it('throws when cantidad is zero or negative', () => {
    expect(() =>
      DetalleFactura.create({
        id: DetalleFacturaId.create('F-0001', 'P001'),
        cantidad: 0,
        precioVenta: 10,
      }),
    ).toThrow('DetalleFactura cantidad must be an integer greater than zero');
  });

  it('throws when precioVenta is negative', () => {
    expect(() =>
      DetalleFactura.create({
        id: DetalleFacturaId.create('F-0001', 'P001'),
        cantidad: 1,
        precioVenta: -5,
      }),
    ).toThrow('DetalleFactura precioVenta cannot be negative');
  });
});
