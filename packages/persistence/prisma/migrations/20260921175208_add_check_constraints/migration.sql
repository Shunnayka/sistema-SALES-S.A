-- CHECK constraints from the 3NF data dictionary.
-- Prisma's stable schema API (v6) does not support declaring raw CHECK
-- constraints in schema.prisma, so they are added here as a hand-written
-- migration on top of the Prisma-generated init migration. These mirror
-- docs/sql/schema.sql exactly. Domain-level validation (Producto.create,
-- Cliente.create, Factura.create, etc. in @sistema-sales/core) enforces the
-- same rules at the application layer.

ALTER TABLE "cliente"
  ADD CONSTRAINT "cliente_condicion_cliente_check" CHECK ("condicion_cliente" IN ('activo', 'inactivo'));

ALTER TABLE "vendedor"
  ADD CONSTRAINT "vendedor_sueldo_check" CHECK ("sueldo" > 0);

ALTER TABLE "producto"
  ADD CONSTRAINT "producto_precio_check" CHECK ("precio" >= 0),
  ADD CONSTRAINT "producto_stock_actual_check" CHECK ("stock_actual" >= 0),
  ADD CONSTRAINT "producto_stock_minimo_check" CHECK ("stock_minimo" >= 0);

ALTER TABLE "factura"
  ADD CONSTRAINT "factura_estado_check" CHECK ("estado" IN ('pendiente', 'cancelada', 'anulada'));

ALTER TABLE "detalle_factura"
  ADD CONSTRAINT "detalle_factura_cantidad_check" CHECK ("cantidad" > 0),
  ADD CONSTRAINT "detalle_factura_precio_venta_check" CHECK ("precio_venta" >= 0);

ALTER TABLE "orden_compra"
  ADD CONSTRAINT "orden_compra_estado_check" CHECK ("estado" IN ('pendiente', 'atendida', 'anulada'));

ALTER TABLE "detalle_orden"
  ADD CONSTRAINT "detalle_orden_cantidad_solicitada_check" CHECK ("cantidad_solicitada" > 0);

ALTER TABLE "abastecimiento"
  ADD CONSTRAINT "abastecimiento_precio_check" CHECK ("precio" >= 0);
