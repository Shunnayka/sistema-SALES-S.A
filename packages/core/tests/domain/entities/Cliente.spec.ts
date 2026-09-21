import { describe, it, expect } from 'vitest';
import { Cliente } from '../../../src/domain/entities/Cliente';
import { ClienteId } from '../../../src/domain/value-objects/ClienteId';
import { DistritoId } from '../../../src/domain/value-objects/DistritoId';

function buildCliente(overrides: Partial<Parameters<typeof Cliente.create>[0]> = {}) {
  return Cliente.create({
    id: ClienteId.create('C001'),
    nombreRazonSocial: 'Comercial Andina S.A.',
    direccion: 'Av. Amazonas 123',
    telefono: '0987654321',
    ruc: '1790012345001',
    idDistrito: DistritoId.create('D001'),
    fechaRegistro: new Date('2026-01-15'),
    tipoCliente: 'mayorista',
    condicionCliente: 'activo',
    ...overrides,
  });
}

describe('Cliente', () => {
  it('creates a valid cliente', () => {
    const cliente = buildCliente();

    expect(cliente.getCondicionCliente()).toBe('activo');
  });

  it('throws when ruc is not 13 digits', () => {
    expect(() => buildCliente({ ruc: '123' })).toThrow('Cliente ruc must be exactly 13 digits');
  });

  it('throws when condicionCliente is invalid', () => {
    expect(() =>
      buildCliente({
        condicionCliente: 'suspendido' as unknown as 'activo',
      }),
    ).toThrow('Cliente condicionCliente must be activo or inactivo');
  });

  it('desactivar sets condicionCliente to inactivo', () => {
    const cliente = buildCliente();

    cliente.desactivar();

    expect(cliente.getCondicionCliente()).toBe('inactivo');
  });

  it('activar sets condicionCliente to activo', () => {
    const cliente = buildCliente({ condicionCliente: 'inactivo' });

    cliente.activar();

    expect(cliente.getCondicionCliente()).toBe('activo');
  });
});
