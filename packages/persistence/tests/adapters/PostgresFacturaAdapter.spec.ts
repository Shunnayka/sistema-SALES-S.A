import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { Factura, NumeroFactura, ClienteId, VendedorId, DetalleFactura, DetalleFacturaId } from '@sistema-sales/core';
import { PostgresFacturaAdapter } from '../../src/adapters/PostgresFacturaAdapter';

const prisma = new PrismaClient();
const adapter = new PostgresFacturaAdapter(prisma);

const DISTRITO_ID = 'ZTESTD01';
const CLIENTE_ID = 'ZTESTC01';
const VENDEDOR_ID = 'ZTESTV01';
const PRODUCTO_ID = 'ZTESTP01';
const NUMERO_FACTURA = 'ZTEST-F01';

beforeAll(async () => {
  await prisma.distrito.upsert({
    where: { idDistrito: DISTRITO_ID },
    create: { idDistrito: DISTRITO_ID, descripcion: 'Distrito de prueba' },
    update: {},
  });

  await prisma.cliente.upsert({
    where: { idCliente: CLIENTE_ID },
    create: {
      idCliente: CLIENTE_ID,
      nombreRazonSocial: 'Cliente de prueba',
      direccion: 'Calle de prueba',
      telefono: '0999999999',
      ruc: '1799999999001',
      idDistrito: DISTRITO_ID,
      fechaRegistro: new Date('2026-01-01'),
      tipoCliente: 'minorista',
      condicionCliente: 'activo',
    },
    update: {},
  });

  await prisma.vendedor.upsert({
    where: { idVendedor: VENDEDOR_ID },
    create: {
      idVendedor: VENDEDOR_ID,
      nombres: 'Vendedor',
      apellidos: 'De Prueba',
      sueldo: 500,
      fechaInicio: new Date('2026-01-01'),
      idDistrito: DISTRITO_ID,
      tipoVendedor: 'interno',
    },
    update: {},
  });

  await prisma.producto.upsert({
    where: { idProducto: PRODUCTO_ID },
    create: {
      idProducto: PRODUCTO_ID,
      descripcion: 'Producto de prueba',
      precio: 10,
      stockActual: 100,
      stockMinimo: 5,
      marca: 'TestBrand',
      lineaProducto: 'Test',
      esImportado: false,
    },
    update: {},
  });
});

afterEach(async () => {
  await prisma.detalleFactura.deleteMany({ where: { numeroFactura: NUMERO_FACTURA } });
  await prisma.factura.deleteMany({ where: { numeroFactura: NUMERO_FACTURA } });
});

afterAll(async () => {
  await prisma.producto.deleteMany({ where: { idProducto: PRODUCTO_ID } });
  await prisma.vendedor.deleteMany({ where: { idVendedor: VENDEDOR_ID } });
  await prisma.cliente.deleteMany({ where: { idCliente: CLIENTE_ID } });
  await prisma.distrito.deleteMany({ where: { idDistrito: DISTRITO_ID } });
});

describe('PostgresFacturaAdapter', () => {
  it('returns null when the factura does not exist', async () => {
    const result = await adapter.buscarPorNumero(NumeroFactura.create(NUMERO_FACTURA));

    expect(result).toBeNull();
  });

  it('saves a factura with its detalles and reads it back', async () => {
    const detalle = DetalleFactura.create({
      id: DetalleFacturaId.create(NUMERO_FACTURA, PRODUCTO_ID),
      cantidad: 2,
      precioVenta: 10,
    });

    const factura = Factura.create({
      numeroFactura: NumeroFactura.create(NUMERO_FACTURA),
      fechaRegistro: new Date('2026-03-01'),
      idCliente: ClienteId.create(CLIENTE_ID),
      idVendedor: VendedorId.create(VENDEDOR_ID),
      porcentajeIva: 15,
      detalles: [detalle],
    });

    await adapter.guardar(factura);

    const found = await adapter.buscarPorNumero(NumeroFactura.create(NUMERO_FACTURA));

    expect(found).not.toBeNull();
    expect(found?.getEstado()).toBe('pendiente');
    expect(found?.getDetalles()).toHaveLength(1);
    expect(found?.calcularTotal()).toBeCloseTo(23);
  });

  it('replaces the detalles when guardar is called again for the same factura', async () => {
    const detalleInicial = DetalleFactura.create({
      id: DetalleFacturaId.create(NUMERO_FACTURA, PRODUCTO_ID),
      cantidad: 1,
      precioVenta: 10,
    });

    await adapter.guardar(
      Factura.create({
        numeroFactura: NumeroFactura.create(NUMERO_FACTURA),
        fechaRegistro: new Date('2026-03-01'),
        idCliente: ClienteId.create(CLIENTE_ID),
        idVendedor: VendedorId.create(VENDEDOR_ID),
        porcentajeIva: 15,
        detalles: [detalleInicial],
      }),
    );

    const detalleActualizado = DetalleFactura.create({
      id: DetalleFacturaId.create(NUMERO_FACTURA, PRODUCTO_ID),
      cantidad: 5,
      precioVenta: 10,
    });

    await adapter.guardar(
      Factura.create({
        numeroFactura: NumeroFactura.create(NUMERO_FACTURA),
        fechaRegistro: new Date('2026-03-01'),
        idCliente: ClienteId.create(CLIENTE_ID),
        idVendedor: VendedorId.create(VENDEDOR_ID),
        porcentajeIva: 15,
        detalles: [detalleActualizado],
      }),
    );

    const found = await adapter.buscarPorNumero(NumeroFactura.create(NUMERO_FACTURA));

    expect(found?.getDetalles()).toHaveLength(1);
    expect(found?.getDetalles()[0].getCantidad()).toBe(5);
  });
});
