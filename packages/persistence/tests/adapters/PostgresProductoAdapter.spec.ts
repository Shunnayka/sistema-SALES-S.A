import { describe, it, expect, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { Producto, ProductoId } from '@sistema-sales/core';
import { PostgresProductoAdapter } from '../../src/adapters/PostgresProductoAdapter';

const prisma = new PrismaClient();
const adapter = new PostgresProductoAdapter(prisma);

const TEST_ID = 'ZTEST0001';

afterEach(async () => {
  await prisma.producto.deleteMany({ where: { idProducto: TEST_ID } });
});

function buildProducto(overrides: Partial<Parameters<typeof Producto.create>[0]> = {}) {
  return Producto.create({
    id: ProductoId.create(TEST_ID),
    descripcion: 'Producto de prueba',
    precio: 99.9,
    stockActual: 5,
    stockMinimo: 2,
    marca: 'TestBrand',
    lineaProducto: 'Test',
    esImportado: false,
    ...overrides,
  });
}

describe('PostgresProductoAdapter', () => {
  it('returns null when the producto does not exist', async () => {
    const result = await adapter.buscarPorId(ProductoId.create(TEST_ID));

    expect(result).toBeNull();
  });

  it('saves a new producto and reads it back', async () => {
    const producto = buildProducto();

    await adapter.guardar(producto);

    const found = await adapter.buscarPorId(ProductoId.create(TEST_ID));

    expect(found).not.toBeNull();
    expect(found?.getDescripcion()).toBe('Producto de prueba');
    expect(found?.getPrecio()).toBe(99.9);
    expect(found?.getStockActual()).toBe(5);
  });

  it('updates an existing producto on guardar', async () => {
    const producto = buildProducto();

    await adapter.guardar(producto);

    producto.actualizarStock(10);
    await adapter.guardar(producto);

    const found = await adapter.buscarPorId(ProductoId.create(TEST_ID));

    expect(found?.getStockActual()).toBe(15);
  });
});
