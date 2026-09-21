import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDistritos() {
  const distritos = [
    { idDistrito: 'D001', descripcion: 'Quito Norte' },
    { idDistrito: 'D002', descripcion: 'Quito Sur' },
    { idDistrito: 'D003', descripcion: 'Quito Centro' },
  ];

  for (const distrito of distritos) {
    await prisma.distrito.upsert({
      where: { idDistrito: distrito.idDistrito },
      create: distrito,
      update: distrito,
    });
  }
}

async function seedClientes() {
  const clientes = [
    {
      idCliente: 'C001',
      nombreRazonSocial: 'Comercial Andina S.A.',
      direccion: 'Av. Amazonas 123',
      telefono: '022345678',
      ruc: '1790012345001',
      idDistrito: 'D001',
      fechaRegistro: new Date('2026-01-15'),
      tipoCliente: 'mayorista',
      condicionCliente: 'activo',
    },
    {
      idCliente: 'C002',
      nombreRazonSocial: 'Juan Perez',
      direccion: 'Calle Sucre 456',
      telefono: '0991234567',
      ruc: '1712345678001',
      idDistrito: 'D002',
      fechaRegistro: new Date('2026-01-20'),
      tipoCliente: 'minorista',
      condicionCliente: 'activo',
    },
  ];

  for (const cliente of clientes) {
    await prisma.cliente.upsert({
      where: { idCliente: cliente.idCliente },
      create: cliente,
      update: cliente,
    });
  }
}

async function seedProveedores() {
  const proveedores = [
    {
      idProveedor: 'PR001',
      razonSocial: 'Distribuidora Nacional S.A.',
      direccion: 'Av. 10 de Agosto 456',
      telefono: '022345679',
      idDistrito: 'D001',
      representanteLegal: 'Maria Fernandez',
    },
    {
      idProveedor: 'PR002',
      razonSocial: 'Importadora del Pacifico S.A.',
      direccion: 'Av. Occidental 789',
      telefono: '022345680',
      idDistrito: 'D003',
      representanteLegal: 'Carlos Vega',
    },
  ];

  for (const proveedor of proveedores) {
    await prisma.proveedor.upsert({
      where: { idProveedor: proveedor.idProveedor },
      create: proveedor,
      update: proveedor,
    });
  }
}

async function seedVendedores() {
  const vendedores = [
    {
      idVendedor: 'V001',
      nombres: 'Carlos',
      apellidos: 'Ramirez',
      sueldo: 600,
      fechaInicio: new Date('2025-06-01'),
      idDistrito: 'D001',
      tipoVendedor: 'interno',
    },
    {
      idVendedor: 'V002',
      nombres: 'Ana',
      apellidos: 'Torres',
      sueldo: 550,
      fechaInicio: new Date('2025-08-15'),
      idDistrito: 'D002',
      tipoVendedor: 'externo',
    },
  ];

  for (const vendedor of vendedores) {
    await prisma.vendedor.upsert({
      where: { idVendedor: vendedor.idVendedor },
      create: vendedor,
      update: vendedor,
    });
  }
}

async function seedProductos() {
  const productos = [
    {
      idProducto: 'P001',
      descripcion: 'Laptop 14 pulgadas',
      precio: 850,
      stockActual: 10,
      stockMinimo: 5,
      marca: 'Acme',
      lineaProducto: 'Computo',
      esImportado: true,
    },
    {
      idProducto: 'P002',
      descripcion: 'Mouse inalambrico',
      precio: 15,
      stockActual: 3,
      stockMinimo: 10,
      marca: 'Acme',
      lineaProducto: 'Accesorios',
      esImportado: false,
    },
    {
      idProducto: 'P003',
      descripcion: 'Teclado mecanico',
      precio: 45,
      stockActual: 20,
      stockMinimo: 8,
      marca: 'TeckPro',
      lineaProducto: 'Accesorios',
      esImportado: true,
    },
    {
      idProducto: 'P004',
      descripcion: 'Monitor 24 pulgadas',
      precio: 220,
      stockActual: 2,
      stockMinimo: 5,
      marca: 'VisionMax',
      lineaProducto: 'Computo',
      esImportado: true,
    },
    {
      idProducto: 'P005',
      descripcion: 'Impresora multifuncion',
      precio: 180,
      stockActual: 12,
      stockMinimo: 4,
      marca: 'PrintFast',
      lineaProducto: 'Oficina',
      esImportado: false,
    },
  ];

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { idProducto: producto.idProducto },
      create: producto,
      update: producto,
    });
  }
}

async function seedFacturas() {
  await prisma.factura.upsert({
    where: { numeroFactura: 'F-0001' },
    create: {
      numeroFactura: 'F-0001',
      fechaRegistro: new Date('2026-03-01'),
      idCliente: 'C001',
      estado: 'pendiente',
      idVendedor: 'V001',
      porcentajeIva: 15,
    },
    update: {
      fechaRegistro: new Date('2026-03-01'),
      idCliente: 'C001',
      estado: 'pendiente',
      idVendedor: 'V001',
      porcentajeIva: 15,
    },
  });

  await prisma.detalleFactura.upsert({
    where: { numeroFactura_idProducto: { numeroFactura: 'F-0001', idProducto: 'P001' } },
    create: { numeroFactura: 'F-0001', idProducto: 'P001', cantidad: 1, precioVenta: 850 },
    update: { cantidad: 1, precioVenta: 850 },
  });

  await prisma.detalleFactura.upsert({
    where: { numeroFactura_idProducto: { numeroFactura: 'F-0001', idProducto: 'P002' } },
    create: { numeroFactura: 'F-0001', idProducto: 'P002', cantidad: 2, precioVenta: 15 },
    update: { cantidad: 2, precioVenta: 15 },
  });

  await prisma.factura.upsert({
    where: { numeroFactura: 'F-0002' },
    create: {
      numeroFactura: 'F-0002',
      fechaRegistro: new Date('2026-02-15'),
      idCliente: 'C002',
      fechaCancelacion: new Date('2026-02-20'),
      estado: 'cancelada',
      idVendedor: 'V002',
      porcentajeIva: 15,
    },
    update: {
      fechaRegistro: new Date('2026-02-15'),
      idCliente: 'C002',
      fechaCancelacion: new Date('2026-02-20'),
      estado: 'cancelada',
      idVendedor: 'V002',
      porcentajeIva: 15,
    },
  });

  await prisma.detalleFactura.upsert({
    where: { numeroFactura_idProducto: { numeroFactura: 'F-0002', idProducto: 'P003' } },
    create: { numeroFactura: 'F-0002', idProducto: 'P003', cantidad: 1, precioVenta: 45 },
    update: { cantidad: 1, precioVenta: 45 },
  });
}

async function seedOrdenesCompra() {
  await prisma.ordenCompra.upsert({
    where: { numeroOrden: 'OC-0001' },
    create: {
      numeroOrden: 'OC-0001',
      fechaRegistro: new Date('2026-03-02'),
      idProveedor: 'PR001',
      estado: 'pendiente',
    },
    update: {
      fechaRegistro: new Date('2026-03-02'),
      idProveedor: 'PR001',
      estado: 'pendiente',
    },
  });

  await prisma.detalleOrdenCompra.upsert({
    where: { numeroOrden_idProducto: { numeroOrden: 'OC-0001', idProducto: 'P002' } },
    create: { numeroOrden: 'OC-0001', idProducto: 'P002', cantidadSolicitada: 50 },
    update: { cantidadSolicitada: 50 },
  });

  await prisma.detalleOrdenCompra.upsert({
    where: { numeroOrden_idProducto: { numeroOrden: 'OC-0001', idProducto: 'P004' } },
    create: { numeroOrden: 'OC-0001', idProducto: 'P004', cantidadSolicitada: 30 },
    update: { cantidadSolicitada: 30 },
  });

  await prisma.ordenCompra.upsert({
    where: { numeroOrden: 'OC-0002' },
    create: {
      numeroOrden: 'OC-0002',
      fechaRegistro: new Date('2026-02-10'),
      idProveedor: 'PR002',
      fechaAtencion: new Date('2026-02-18'),
      estado: 'atendida',
    },
    update: {
      fechaRegistro: new Date('2026-02-10'),
      idProveedor: 'PR002',
      fechaAtencion: new Date('2026-02-18'),
      estado: 'atendida',
    },
  });

  await prisma.detalleOrdenCompra.upsert({
    where: { numeroOrden_idProducto: { numeroOrden: 'OC-0002', idProducto: 'P005' } },
    create: { numeroOrden: 'OC-0002', idProducto: 'P005', cantidadSolicitada: 20 },
    update: { cantidadSolicitada: 20 },
  });
}

async function seedAbastecimientos() {
  const abastecimientos = [
    { idProveedor: 'PR001', idProducto: 'P001', precio: 700 },
    { idProveedor: 'PR001', idProducto: 'P002', precio: 10 },
    { idProveedor: 'PR002', idProducto: 'P004', precio: 180 },
  ];

  for (const abastecimiento of abastecimientos) {
    await prisma.abastecimiento.upsert({
      where: {
        idProveedor_idProducto: {
          idProveedor: abastecimiento.idProveedor,
          idProducto: abastecimiento.idProducto,
        },
      },
      create: abastecimiento,
      update: abastecimiento,
    });
  }
}

async function main() {
  await seedDistritos();
  await seedClientes();
  await seedProveedores();
  await seedVendedores();
  await seedProductos();
  await seedFacturas();
  await seedOrdenesCompra();
  await seedAbastecimientos();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
