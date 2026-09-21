import { describe, it, expect } from 'vitest';
import { OrdenCompra } from '../../../src/domain/entities/OrdenCompra';
import { NumeroOrden } from '../../../src/domain/value-objects/NumeroOrden';
import { ProveedorId } from '../../../src/domain/value-objects/ProveedorId';

function buildOrdenCompra(overrides: Partial<Parameters<typeof OrdenCompra.create>[0]> = {}) {
  return OrdenCompra.create({
    numeroOrden: NumeroOrden.create('OC-0001'),
    fechaRegistro: new Date('2026-03-01'),
    idProveedor: ProveedorId.create('PR001'),
    ...overrides,
  });
}

describe('OrdenCompra', () => {
  it('creates a valid orden defaulting estado to pendiente', () => {
    const orden = buildOrdenCompra();

    expect(orden.getEstado()).toBe('pendiente');
  });

  it('atender transitions estado to atendida and sets fechaAtencion', () => {
    const orden = buildOrdenCompra();
    const fechaAtencion = new Date('2026-03-10');

    orden.atender(fechaAtencion);

    expect(orden.getEstado()).toBe('atendida');
    expect(orden.getFechaAtencion()).toBe(fechaAtencion);
  });

  it('throws when atender is called on a non pendiente orden', () => {
    const orden = buildOrdenCompra();
    orden.atender(new Date('2026-03-10'));

    expect(() => orden.atender(new Date('2026-03-11'))).toThrow('Only a pendiente orden can be atendida');
  });

  it('anular transitions estado to anulada', () => {
    const orden = buildOrdenCompra();

    orden.anular();

    expect(orden.getEstado()).toBe('anulada');
  });

  it('throws when anular is called on an atendida orden', () => {
    const orden = buildOrdenCompra();
    orden.atender(new Date('2026-03-10'));

    expect(() => orden.anular()).toThrow('An atendida orden cannot be anulada');
  });
});
