-- CreateTable
CREATE TABLE "distrito" (
    "id_distrito" VARCHAR(10) NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,

    CONSTRAINT "distrito_pkey" PRIMARY KEY ("id_distrito")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" VARCHAR(10) NOT NULL,
    "nombre_razon_social" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "ruc" VARCHAR(13) NOT NULL,
    "id_distrito" VARCHAR(10) NOT NULL,
    "fecha_registro" DATE NOT NULL,
    "tipo_cliente" VARCHAR(30) NOT NULL,
    "condicion_cliente" VARCHAR(20) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" VARCHAR(10) NOT NULL,
    "razon_social" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "id_distrito" VARCHAR(10) NOT NULL,
    "representante_legal" VARCHAR(120) NOT NULL,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "vendedor" (
    "id_vendedor" VARCHAR(10) NOT NULL,
    "nombres" VARCHAR(80) NOT NULL,
    "apellidos" VARCHAR(80) NOT NULL,
    "sueldo" DECIMAL(10,2) NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "id_distrito" VARCHAR(10) NOT NULL,
    "tipo_vendedor" VARCHAR(30) NOT NULL,

    CONSTRAINT "vendedor_pkey" PRIMARY KEY ("id_vendedor")
);

-- CreateTable
CREATE TABLE "producto" (
    "id_producto" VARCHAR(10) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL,
    "marca" VARCHAR(60) NOT NULL,
    "linea_producto" VARCHAR(60) NOT NULL,
    "es_importado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "factura" (
    "numero_factura" VARCHAR(15) NOT NULL,
    "fecha_registro" DATE NOT NULL,
    "id_cliente" VARCHAR(10) NOT NULL,
    "fecha_cancelacion" DATE,
    "estado" VARCHAR(20) NOT NULL,
    "id_vendedor" VARCHAR(10) NOT NULL,
    "porcentaje_iva" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("numero_factura")
);

-- CreateTable
CREATE TABLE "detalle_factura" (
    "numero_factura" VARCHAR(15) NOT NULL,
    "id_producto" VARCHAR(10) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_venta" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_factura_pkey" PRIMARY KEY ("numero_factura","id_producto")
);

-- CreateTable
CREATE TABLE "orden_compra" (
    "numero_orden" VARCHAR(15) NOT NULL,
    "fecha_registro" DATE NOT NULL,
    "id_proveedor" VARCHAR(10) NOT NULL,
    "fecha_atencion" DATE,
    "estado" VARCHAR(20) NOT NULL,

    CONSTRAINT "orden_compra_pkey" PRIMARY KEY ("numero_orden")
);

-- CreateTable
CREATE TABLE "detalle_orden" (
    "numero_orden" VARCHAR(15) NOT NULL,
    "id_producto" VARCHAR(10) NOT NULL,
    "cantidad_solicitada" INTEGER NOT NULL,

    CONSTRAINT "detalle_orden_pkey" PRIMARY KEY ("numero_orden","id_producto")
);

-- CreateTable
CREATE TABLE "abastecimiento" (
    "id_proveedor" VARCHAR(10) NOT NULL,
    "id_producto" VARCHAR(10) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "abastecimiento_pkey" PRIMARY KEY ("id_proveedor","id_producto")
);

-- CreateIndex
CREATE UNIQUE INDEX "cliente_ruc_key" ON "cliente"("ruc");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_distrito_fkey" FOREIGN KEY ("id_distrito") REFERENCES "distrito"("id_distrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedor" ADD CONSTRAINT "proveedor_id_distrito_fkey" FOREIGN KEY ("id_distrito") REFERENCES "distrito"("id_distrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendedor" ADD CONSTRAINT "vendedor_id_distrito_fkey" FOREIGN KEY ("id_distrito") REFERENCES "distrito"("id_distrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_id_vendedor_fkey" FOREIGN KEY ("id_vendedor") REFERENCES "vendedor"("id_vendedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura" ADD CONSTRAINT "detalle_factura_numero_factura_fkey" FOREIGN KEY ("numero_factura") REFERENCES "factura"("numero_factura") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura" ADD CONSTRAINT "detalle_factura_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_compra" ADD CONSTRAINT "orden_compra_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden" ADD CONSTRAINT "detalle_orden_numero_orden_fkey" FOREIGN KEY ("numero_orden") REFERENCES "orden_compra"("numero_orden") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_orden" ADD CONSTRAINT "detalle_orden_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abastecimiento" ADD CONSTRAINT "abastecimiento_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abastecimiento" ADD CONSTRAINT "abastecimiento_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
