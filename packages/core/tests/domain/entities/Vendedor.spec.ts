import { describe, it, expect } from 'vitest';
import { Vendedor } from '../../../src/domain/entities/Vendedor';
import { VendedorId } from '../../../src/domain/value-objects/VendedorId';
import { DistritoId } from '../../../src/domain/value-objects/DistritoId';

function buildVendedor(overrides: Partial<Parameters<typeof Vendedor.create>[0]> = {}) {
  return Vendedor.create({
    id: VendedorId.create('V001'),
    nombres: 'Carlos',
    apellidos: 'Ramirez',
    sueldo: 600,
    fechaInicio: new Date('2026-02-01'),
    idDistrito: DistritoId.create('D001'),
    tipoVendedor: 'interno',
    ...overrides,
  });
}

describe('Vendedor', () => {
  it('creates a valid vendedor', () => {
    const vendedor = buildVendedor();

    expect(vendedor.getSueldo()).toBe(600);
  });

  it('throws when sueldo is zero or negative', () => {
    expect(() => buildVendedor({ sueldo: 0 })).toThrow('Vendedor sueldo must be greater than zero');
  });

  it('throws when nombres is empty', () => {
    expect(() => buildVendedor({ nombres: '  ' })).toThrow('Vendedor nombres cannot be empty');
  });
});
