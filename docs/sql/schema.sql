-- SISTEMA_SALES S. A.
-- Database creation script (PostgreSQL 18)
-- Academic annex: mirrors packages/persistence/prisma/schema.prisma and its
-- generated migration under packages/persistence/prisma/migrations/.

CREATE TABLE distrito (
    id_distrito   VARCHAR(10) PRIMARY KEY,
    descripcion   VARCHAR(100) NOT NULL
);

CREATE TABLE cliente (
    id_cliente          VARCHAR(10) PRIMARY KEY,
    nombre_razon_social VARCHAR(150) NOT NULL,
    direccion           VARCHAR(200) NOT NULL,
    telefono            VARCHAR(15) NOT NULL,
    ruc                 VARCHAR(13) UNIQUE NOT NULL,
    id_distrito         VARCHAR(10) NOT NULL REFERENCES distrito (id_distrito),
    fecha_registro      DATE NOT NULL,
    tipo_cliente        VARCHAR(30) NOT NULL,
    condicion_cliente   VARCHAR(20) NOT NULL CHECK (condicion_cliente IN ('activo', 'inactivo'))
);

CREATE TABLE proveedor (
    id_proveedor        VARCHAR(10) PRIMARY KEY,
    razon_social        VARCHAR(150) NOT NULL,
    direccion           VARCHAR(200) NOT NULL,
    telefono            VARCHAR(15) NOT NULL,
    id_distrito         VARCHAR(10) NOT NULL REFERENCES distrito (id_distrito),
    representante_legal VARCHAR(120) NOT NULL
);

CREATE TABLE vendedor (
    id_vendedor    VARCHAR(10) PRIMARY KEY,
    nombres        VARCHAR(80) NOT NULL,
    apellidos      VARCHAR(80) NOT NULL,
    sueldo         DECIMAL(10, 2) NOT NULL CHECK (sueldo > 0),
    fecha_inicio   DATE NOT NULL,
    id_distrito    VARCHAR(10) NOT NULL REFERENCES distrito (id_distrito),
    tipo_vendedor  VARCHAR(30) NOT NULL
);

CREATE TABLE producto (
    id_producto     VARCHAR(10) PRIMARY KEY,
    descripcion     VARCHAR(200) NOT NULL,
    precio          DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    stock_actual    INT NOT NULL CHECK (stock_actual >= 0),
    stock_minimo    INT NOT NULL CHECK (stock_minimo >= 0),
    marca           VARCHAR(60) NOT NULL,
    linea_producto  VARCHAR(60) NOT NULL,
    es_importado    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE factura (
    numero_factura     VARCHAR(15) PRIMARY KEY,
    fecha_registro     DATE NOT NULL,
    id_cliente         VARCHAR(10) NOT NULL REFERENCES cliente (id_cliente),
    fecha_cancelacion  DATE NULL,
    estado             VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'cancelada', 'anulada')),
    id_vendedor        VARCHAR(10) NOT NULL REFERENCES vendedor (id_vendedor),
    porcentaje_iva     DECIMAL(5, 2) NOT NULL
);

CREATE TABLE detalle_factura (
    numero_factura  VARCHAR(15) NOT NULL REFERENCES factura (numero_factura) ON DELETE CASCADE,
    id_producto     VARCHAR(10) NOT NULL REFERENCES producto (id_producto) ON DELETE RESTRICT,
    cantidad        INT NOT NULL CHECK (cantidad > 0),
    precio_venta    DECIMAL(10, 2) NOT NULL CHECK (precio_venta >= 0),
    PRIMARY KEY (numero_factura, id_producto)
);

CREATE TABLE orden_compra (
    numero_orden    VARCHAR(15) PRIMARY KEY,
    fecha_registro  DATE NOT NULL,
    id_proveedor    VARCHAR(10) NOT NULL REFERENCES proveedor (id_proveedor),
    fecha_atencion  DATE NULL,
    estado          VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'atendida', 'anulada'))
);

CREATE TABLE detalle_orden (
    numero_orden        VARCHAR(15) NOT NULL REFERENCES orden_compra (numero_orden) ON DELETE CASCADE,
    id_producto         VARCHAR(10) NOT NULL REFERENCES producto (id_producto) ON DELETE RESTRICT,
    cantidad_solicitada INT NOT NULL CHECK (cantidad_solicitada > 0),
    PRIMARY KEY (numero_orden, id_producto)
);

CREATE TABLE abastecimiento (
    id_proveedor  VARCHAR(10) NOT NULL REFERENCES proveedor (id_proveedor),
    id_producto   VARCHAR(10) NOT NULL REFERENCES producto (id_producto),
    precio        DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    PRIMARY KEY (id_proveedor, id_producto)
);
