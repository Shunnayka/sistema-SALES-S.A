import { describe, it, expect, vi } from 'vitest';
import { VentaService } from '../../src/application/VentaService';
import { Producto } from '../../src/domain/entities/Producto';
import { ProductoId } from '../../src/domain/value-objects/ProductoId';
import { ProductoRepositoryPort } from '../../src/ports/output/ProductoRepositoryPort';
import { FacturaRepositoryPort } from '../../src/ports/output/FacturaRepositoryPort';

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

describe('VentaService', () => {
  it('discounts stock, saves the producto and saves the factura', async () => {
    const producto = buildProducto(10);
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(producto),
      guardar: vi.fn().mockResolvedValue(undefined),
    };
    const facturaRepository: FacturaRepositoryPort = {
      guardar: vi.fn().mockResolvedValue(undefined),
      buscarPorNumero: vi.fn(),
    };

    const service = new VentaService(productoRepository, facturaRepository);

    const factura = await service.ejecutar({
      numeroFactura: 'F-0001',
      idCliente: 'C001',
      idVendedor: 'V001',
      porcentajeIva: 15,
      detalles: [{ idProducto: 'P001', cantidad: 3, precioVenta: 850 }],
    });

    expect(producto.getStockActual()).toBe(7);
    expect(productoRepository.guardar).toHaveBeenCalledWith(producto);
    expect(facturaRepository.guardar).toHaveBeenCalledWith(factura);
    expect(factura.calcularTotal()).toBeCloseTo(2932.5);
  });

  it('throws when the producto does not exist', async () => {
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(null),
      guardar: vi.fn(),
    };
    const facturaRepository: FacturaRepositoryPort = {
      guardar: vi.fn(),
      buscarPorNumero: vi.fn(),
    };

    const service = new VentaService(productoRepository, facturaRepository);

    await expect(
      service.ejecutar({
        numeroFactura: 'F-0001',
        idCliente: 'C001',
        idVendedor: 'V001',
        porcentajeIva: 15,
        detalles: [{ idProducto: 'P999', cantidad: 1, precioVenta: 10 }],
      }),
    ).rejects.toThrow('Producto P999 not found');
  });

  it('propagates the error when stock is insufficient', async () => {
    const producto = buildProducto(1);
    const productoRepository: ProductoRepositoryPort = {
      buscarPorId: vi.fn().mockResolvedValue(producto),
      guardar: vi.fn(),
    };
    const facturaRepository: FacturaRepositoryPort = {
      guardar: vi.fn(),
      buscarPorNumero: vi.fn(),
    };

    const service = new VentaService(productoRepository, facturaRepository);

    await expect(
      service.ejecutar({
        numeroFactura: 'F-0001',
        idCliente: 'C001',
        idVendedor: 'V001',
        porcentajeIva: 15,
        detalles: [{ idProducto: 'P001', cantidad: 5, precioVenta: 850 }],
      }),
    ).rejects.toThrow('Producto stock cannot become negative');
  });
});
