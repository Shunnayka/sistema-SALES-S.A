// Value objects
export * from './domain/value-objects/Identifier';
export * from './domain/value-objects/ProductoId';
export * from './domain/value-objects/ClienteId';
export * from './domain/value-objects/VendedorId';
export * from './domain/value-objects/ProveedorId';
export * from './domain/value-objects/DistritoId';
export * from './domain/value-objects/NumeroFactura';
export * from './domain/value-objects/NumeroOrden';
export * from './domain/value-objects/DetalleFacturaId';
export * from './domain/value-objects/DetalleOrdenCompraId';

// Entities
export * from './domain/entities/Producto';
export * from './domain/entities/Cliente';
export * from './domain/entities/Vendedor';
export * from './domain/entities/Proveedor';
export * from './domain/entities/Distrito';
export * from './domain/entities/Factura';
export * from './domain/entities/DetalleFactura';
export * from './domain/entities/OrdenCompra';
export * from './domain/entities/DetalleOrdenCompra';

// Input ports
export * from './ports/input/RegistrarVentaUseCase';
export * from './ports/input/GestionarInventarioUseCase';
export * from './ports/input/GestionarAbastecimientoUseCase';

// Output ports
export * from './ports/output/ProductoRepositoryPort';
export * from './ports/output/FacturaRepositoryPort';
export * from './ports/output/OrdenCompraRepositoryPort';

// Application services
export * from './application/VentaService';
export * from './application/InventarioService';
export * from './application/AbastecimientoService';
