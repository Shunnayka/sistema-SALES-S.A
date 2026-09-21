import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { OrdenCompra, NumeroOrden, ProveedorId, DetalleOrdenCompra, DetalleOrdenCompraId } from '@sistema-sales/core';
import { PostgresOrdenCompraAdapter } from '../../src/adapters/PostgresOrdenCompraAdapter';

const prisma = new PrismaClient();
const adapter = new PostgresOrdenCompraAdapter(prisma);

const DISTRITO_ID = 'ZTESTD02';
const PROVEEDOR_ID = 'ZTESTPR2';
const PRODUCTO_ID = 'ZTESTP02';
const NUMERO_ORDEN = 'ZTEST-OC2';

beforeAll(async () => {
  await prisma.distrito.upsert({
    where: { idDistrito: DISTRITO_ID },
    create: { idDistrito: DISTRITO_ID, descripcion: 'Distrito de prueba 2' },
    update: {},
  });

  await prisma.proveedor.upsert({
    where: { idProveedor: PROVEEDOR_ID },
    create: {
      idProveedor: PROVEEDOR_ID,
      razonSocial: 'Proveedor de prueba',
      direccion: 'Calle de prueba',
      telefono: '022222222',
      idDistrito: DISTRITO_ID,
      representanteLegal: 'Representante de prueba',
    },
    update: {},
  });

  await prisma.producto.upsert({
    where: { idProducto: PRODUCTO_ID },
    create: {
      idProducto: PRODUCTO_ID,
      descripcion: 'Producto de prueba 2',
      precio: 20,
      stockActual: 50,
      stockMinimo: 5,
      marca: 'TestBrand',
      lineaProducto: 'Test',
      esImportado: false,
    },
    update: {},
  });
});

afterEach(async () => {
  await prisma.detalleOrdenCompra.deleteMany({ where: { numeroOrden: NUMERO_ORDEN } });
  await prisma.ordenCompra.deleteMany({ where: { numeroOrden: NUMERO_ORDEN } });
});

afterAll(async () => {
  await prisma.producto.deleteMany({ where: { idProducto: PRODUCTO_ID } });
  await prisma.proveedor.deleteMany({ where: { idProveedor: PROVEEDOR_ID } });
  await prisma.distrito.deleteMany({ where: { idDistrito: DISTRITO_ID } });
});

describe('PostgresOrdenCompraAdapter', () => {
  it('saves an orden de compra with its detalles', async () => {
    const detalle = DetalleOrdenCompra.create({
      id: DetalleOrdenCompraId.create(NUMERO_ORDEN, PRODUCTO_ID),
      cantidadSolicitada: 25,
    });

    const orden = OrdenCompra.create({
      numeroOrden: NumeroOrden.create(NUMERO_ORDEN),
      fechaRegistro: new Date('2026-03-05'),
      idProveedor: ProveedorId.create(PROVEEDOR_ID),
      detalles: [detalle],
    });

    await adapter.guardar(orden);

    const row = await prisma.ordenCompra.findUnique({
      where: { numeroOrden: NUMERO_ORDEN },
      include: { detalles: true },
    });

    expect(row).not.toBeNull();
    expect(row?.estado).toBe('pendiente');
    expect(row?.detalles).toHaveLength(1);
    expect(row?.detalles[0].cantidadSolicitada).toBe(25);
  });

  it('replaces existing detalles and reflects estado changes on guardar', async () => {
    const detalle = DetalleOrdenCompra.create({
      id: DetalleOrdenCompraId.create(NUMERO_ORDEN, PRODUCTO_ID),
      cantidadSolicitada: 10,
    });

    await adapter.guardar(
      OrdenCompra.create({
        numeroOrden: NumeroOrden.create(NUMERO_ORDEN),
        fechaRegistro: new Date('2026-03-05'),
        idProveedor: ProveedorId.create(PROVEEDOR_ID),
        detalles: [detalle],
      }),
    );

    await adapter.guardar(
      OrdenCompra.create({
        numeroOrden: NumeroOrden.create(NUMERO_ORDEN),
        fechaRegistro: new Date('2026-03-05'),
        idProveedor: ProveedorId.create(PROVEEDOR_ID),
        estado: 'atendida',
        fechaAtencion: new Date('2026-03-10'),
        detalles: [detalle],
      }),
    );

    const row = await prisma.ordenCompra.findUnique({
      where: { numeroOrden: NUMERO_ORDEN },
      include: { detalles: true },
    });

    expect(row?.estado).toBe('atendida');
    expect(row?.detalles).toHaveLength(1);
  });
});
