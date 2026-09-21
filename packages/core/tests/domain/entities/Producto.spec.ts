import { describe, it, expect } from 'vitest';
import { Producto } from '../../../src/domain/entities/Producto';
import { ProductoId } from '../../../src/domain/value-objects/ProductoId';

function buildProducto(overrides: Partial<Parameters<typeof Producto.create>[0]> = {}) {
  return Producto.create({
    id: ProductoId.create('P001'),
    descripcion: 'Laptop 14 pulgadas',
    precio: 850.5,
    stockActual: 10,
    stockMinimo: 5,
    marca: 'Acme',
    lineaProducto: 'Computo',
    esImportado: true,
    ...overrides,
  });
}

describe('Producto', () => {
  it('creates a valid producto', () => {
    const producto = buildProducto();

    expect(producto.getDescripcion()).toBe('Laptop 14 pulgadas');
    expect(producto.getStockActual()).toBe(10);
  });

  it('throws when descripcion is empty', () => {
    expect(() => buildProducto({ descripcion: '  ' })).toThrow('Producto descripcion cannot be empty');
  });

  it('throws when precio is negative', () => {
    expect(() => buildProducto({ precio: -1 })).toThrow('Producto precio cannot be negative');
  });

  it('throws when stockActual is negative', () => {
    expect(() => buildProducto({ stockActual: -1 })).toThrow('Producto stockActual cannot be negative');
  });

  it('indicates it needs reabastecimiento when stockActual is at or below stockMinimo', () => {
    const producto = buildProducto({ stockActual: 5, stockMinimo: 5 });

    expect(producto.necesitaReabastecimiento()).toBe(true);
  });

  it('indicates it does not need reabastecimiento when stockActual is above stockMinimo', () => {
    const producto = buildProducto({ stockActual: 10, stockMinimo: 5 });

    expect(producto.necesitaReabastecimiento()).toBe(false);
  });

  it('increases stock when actualizarStock receives a positive amount', () => {
    const producto = buildProducto({ stockActual: 10 });

    producto.actualizarStock(5);

    expect(producto.getStockActual()).toBe(15);
  });

  it('decreases stock when actualizarStock receives a negative amount', () => {
    const producto = buildProducto({ stockActual: 10 });

    producto.actualizarStock(-4);

    expect(producto.getStockActual()).toBe(6);
  });

  it('throws when actualizarStock would make stock negative', () => {
    const producto = buildProducto({ stockActual: 3 });

    expect(() => producto.actualizarStock(-4)).toThrow('Producto stock cannot become negative');
  });
});
