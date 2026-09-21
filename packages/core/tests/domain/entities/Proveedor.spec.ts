import { describe, it, expect } from 'vitest';
import { Proveedor } from '../../../src/domain/entities/Proveedor';
import { ProveedorId } from '../../../src/domain/value-objects/ProveedorId';
import { DistritoId } from '../../../src/domain/value-objects/DistritoId';

function buildProveedor(overrides: Partial<Parameters<typeof Proveedor.create>[0]> = {}) {
  return Proveedor.create({
    id: ProveedorId.create('PR001'),
    razonSocial: 'Distribuidora Nacional S.A.',
    direccion: 'Av. 10 de Agosto 456',
    telefono: '022345678',
    idDistrito: DistritoId.create('D001'),
    representanteLegal: 'Maria Fernandez',
    ...overrides,
  });
}

describe('Proveedor', () => {
  it('creates a valid proveedor', () => {
    const proveedor = buildProveedor();

    expect(proveedor.getRepresentanteLegal()).toBe('Maria Fernandez');
  });

  it('throws when razonSocial is empty', () => {
    expect(() => buildProveedor({ razonSocial: '  ' })).toThrow('Proveedor razonSocial cannot be empty');
  });

  it('throws when representanteLegal is empty', () => {
    expect(() => buildProveedor({ representanteLegal: '  ' })).toThrow('Proveedor representanteLegal cannot be empty');
  });
});
