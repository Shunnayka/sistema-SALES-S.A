import { describe, it, expect } from 'vitest';
import { Factura } from '../../../src/domain/entities/Factura';
import { DetalleFactura } from '../../../src/domain/entities/DetalleFactura';
import { NumeroFactura } from '../../../src/domain/value-objects/NumeroFactura';
import { ClienteId } from '../../../src/domain/value-objects/ClienteId';
import { VendedorId } from '../../../src/domain/value-objects/VendedorId';
import { DetalleFacturaId } from '../../../src/domain/value-objects/DetalleFacturaId';

function buildFactura(overrides: Partial<Parameters<typeof Factura.create>[0]> = {}) {
  return Factura.create({
    numeroFactura: NumeroFactura.create('F-0001'),
    fechaRegistro: new Date('2026-03-01'),
    idCliente: ClienteId.create('C001'),
    idVendedor: VendedorId.create('V001'),
    porcentajeIva: 15,
    ...overrides,
  });
}

describe('Factura', () => {
  it('creates a valid factura defaulting estado to pendiente', () => {
    const factura = buildFactura();

    expect(factura.getEstado()).toBe('pendiente');
  });

  it('throws when porcentajeIva is negative', () => {
    expect(() => buildFactura({ porcentajeIva: -1 })).toThrow('Factura porcentajeIva cannot be negative');
  });

  it('calcularTotal sums subtotales and applies the iva percentage', () => {
    const detalleUno = DetalleFactura.create({
      id: DetalleFacturaId.create('F-0001', 'P001'),
      cantidad: 2,
      precioVenta: 100,
    });
    const detalleDos = DetalleFactura.create({
      id: DetalleFacturaId.create('F-0001', 'P002'),
      cantidad: 1,
      precioVenta: 50,
    });

    const factura = buildFactura({ porcentajeIva: 15, detalles: [detalleUno, detalleDos] });

    expect(factura.calcularTotal()).toBeCloseTo(287.5);
  });

  it('cancelar transitions estado to cancelada and sets fechaCancelacion', () => {
    const factura = buildFactura();
    const fechaCancelacion = new Date('2026-03-05');

    factura.cancelar(fechaCancelacion);

    expect(factura.getEstado()).toBe('cancelada');
    expect(factura.getFechaCancelacion()).toBe(fechaCancelacion);
  });

  it('throws when cancelar is called on a non pendiente factura', () => {
    const factura = buildFactura();
    factura.cancelar(new Date('2026-03-05'));

    expect(() => factura.cancelar(new Date('2026-03-06'))).toThrow('Only a pendiente factura can be cancelada');
  });

  it('anular transitions estado to anulada', () => {
    const factura = buildFactura();

    factura.anular();

    expect(factura.getEstado()).toBe('anulada');
  });

  it('throws when anular is called on a cancelada factura', () => {
    const factura = buildFactura();
    factura.cancelar(new Date('2026-03-05'));

    expect(() => factura.anular()).toThrow('A cancelada factura cannot be anulada');
  });
});
