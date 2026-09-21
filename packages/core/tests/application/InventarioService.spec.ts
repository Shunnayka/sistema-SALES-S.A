import { describe, it, expect, vi } from 'vitest';
import { InventarioService } from '../../src/application/InventarioService';
import { Producto } from '../../src/domain/entities/Producto';
import { ProductoId } from '../../src/domain/value-objects/ProductoId';
import { ProductoRepositoryPort } from '../../src/ports/output/ProductoRepositoryPort';

function buildProducto(stockActual: number) {
  return Producto.create({
    id: ProductoId.create('P001'),
    descripcion: 'Laptop 14 pulgadas',
    precio: 850,
    stockActual,
    stockMinimo: 2,
    marca: 'Acme',
    lineaProducto: 'Computo',
    esImportado: false,
  });
}

describe('InventarioService', () => {
  it('increases stock and saves the producto', async () => {
    const producto = buildProducto(10);
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(producto),
      guardar: vi.fn().mockResolvedValue(undefined),
    };

    const service = new InventarioService(productoRepository);

    await service.ejecutar(ProductoId.create('P001'), 5);

    expect(producto.getStockActual()).toBe(15);
    expect(productoRepository.guardar).toHaveBeenCalledWith(producto);
  });

  it('throws when the producto does not exist', async () => {
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(null),
      guardar: vi.fn(),
    };

    const service = new InventarioService(productoRepository);

    await expect(service.ejecutar(ProductoId.create('P999'), 5)).rejects.toThrow('Producto P999 not found');
  });
});
