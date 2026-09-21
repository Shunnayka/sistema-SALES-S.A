import { describe, it, expect, vi } from 'vitest';
import { AbastecimientoService } from '../../src/application/AbastecimientoService';
import { Producto } from '../../src/domain/entities/Producto';
import { ProductoId } from '../../src/domain/value-objects/ProductoId';
import { ProductoRepositoryPort } from '../../src/ports/output/ProductoRepositoryPort';
import { OrdenCompraRepositoryPort } from '../../src/ports/output/OrdenCompraRepositoryPort';

function buildProducto() {
  return Producto.create({
    id: ProductoId.create('P001'),
    descripcion: 'Laptop 14 pulgadas',
    precio: 850,
    stockActual: 10,
    stockMinimo: 2,
    marca: 'Acme',
    lineaProducto: 'Computo',
    esImportado: false,
  });
}

describe('AbastecimientoService', () => {
  it('creates and saves an orden de compra with its detalles', async () => {
    const producto = buildProducto();
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(producto),
      guardar: vi.fn(),
    };
    const ordenCompraRepository: OrdenCompraRepositoryPort = {
      guardar: vi.fn().mockResolvedValue(undefined),
    };

    const service = new AbastecimientoService(ordenCompraRepository, productoRepository);

    const orden = await service.ejecutar({
      numeroOrden: 'OC-0001',
      idProveedor: 'PR001',
      detalles: [{ idProducto: 'P001', cantidadSolicitada: 50 }],
    });

    expect(orden.getEstado()).toBe('pendiente');
    expect(orden.getDetalles()).toHaveLength(1);
    expect(ordenCompraRepository.guardar).toHaveBeenCalledWith(orden);
  });

  it('throws when a producto in the detalle does not exist', async () => {
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(null),
      guardar: vi.fn(),
    };
    const ordenCompraRepository: OrdenCompraRepositoryPort = {
      guardar: vi.fn(),
    };

    const service = new AbastecimientoService(ordenCompraRepository, productoRepository);

    await expect(
      service.ejecutar({
        numeroOrden: 'OC-0001',
        idProveedor: 'PR001',
        detalles: [{ idProducto: 'P999', cantidadSolicitada: 10 }],
      }),
    ).rejects.toThrow('Producto P999 not found');
  });
});
