import type { EntityConfig } from '../crud/types';

export const distritoConfig: EntityConfig = {
  title: 'Distritos',
  apiPath: '/distritos',
  idField: 'idDistrito',
  columns: [
    { key: 'idDistrito', label: 'ID' },
    { key: 'descripcion', label: 'Descripcion' },
  ],
  fields: [
    { key: 'idDistrito', label: 'ID (max 10)', type: 'text' },
    { key: 'descripcion', label: 'Descripcion', type: 'text' },
  ],
};

export const clienteConfig: EntityConfig = {
  title: 'Clientes',
  apiPath: '/clientes',
  idField: 'idCliente',
  columns: [
    { key: 'idCliente', label: 'ID' },
    { key: 'nombreRazonSocial', label: 'Nombre / Razon Social' },
    { key: 'ruc', label: 'RUC' },
    { key: 'tipoCliente', label: 'Tipo' },
    { key: 'condicionCliente', label: 'Condicion' },
  ],
  fields: [
    { key: 'idCliente', label: 'ID (max 10)', type: 'text' },
    { key: 'nombreRazonSocial', label: 'Nombre / Razon Social', type: 'text' },
    { key: 'direccion', label: 'Direccion', type: 'text' },
    { key: 'telefono', label: 'Telefono', type: 'text' },
    { key: 'ruc', label: 'RUC (13 digitos)', type: 'text' },
    { key: 'idDistrito', label: 'ID Distrito', type: 'text' },
    { key: 'fechaRegistro', label: 'Fecha de registro', type: 'date' },
    { key: 'tipoCliente', label: 'Tipo de cliente', type: 'text' },
    {
      key: 'condicionCliente',
      label: 'Condicion',
      type: 'select',
      options: [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
      ],
    },
  ],
};

export const proveedorConfig: EntityConfig = {
  title: 'Proveedores',
  apiPath: '/proveedores',
  idField: 'idProveedor',
  columns: [
    { key: 'idProveedor', label: 'ID' },
    { key: 'razonSocial', label: 'Razon Social' },
    { key: 'representanteLegal', label: 'Representante Legal' },
  ],
  fields: [
    { key: 'idProveedor', label: 'ID (max 10)', type: 'text' },
    { key: 'razonSocial', label: 'Razon Social', type: 'text' },
    { key: 'direccion', label: 'Direccion', type: 'text' },
    { key: 'telefono', label: 'Telefono', type: 'text' },
    { key: 'idDistrito', label: 'ID Distrito', type: 'text' },
    { key: 'representanteLegal', label: 'Representante Legal', type: 'text' },
  ],
};

export const vendedorConfig: EntityConfig = {
  title: 'Vendedores',
  apiPath: '/vendedores',
  idField: 'idVendedor',
  columns: [
    { key: 'idVendedor', label: 'ID' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'tipoVendedor', label: 'Tipo' },
  ],
  fields: [
    { key: 'idVendedor', label: 'ID (max 10)', type: 'text' },
    { key: 'nombres', label: 'Nombres', type: 'text' },
    { key: 'apellidos', label: 'Apellidos', type: 'text' },
    { key: 'sueldo', label: 'Sueldo', type: 'number' },
    { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date' },
    { key: 'idDistrito', label: 'ID Distrito', type: 'text' },
    { key: 'tipoVendedor', label: 'Tipo de vendedor', type: 'text' },
  ],
};

export const productoConfig: EntityConfig = {
  title: 'Productos',
  apiPath: '/productos',
  idField: 'idProducto',
  columns: [
    { key: 'idProducto', label: 'ID' },
    { key: 'descripcion', label: 'Descripcion' },
    { key: 'precio', label: 'Precio' },
    { key: 'stockActual', label: 'Stock Actual' },
    { key: 'stockMinimo', label: 'Stock Minimo' },
    { key: 'marca', label: 'Marca' },
  ],
  fields: [
    { key: 'idProducto', label: 'ID (max 10)', type: 'text' },
    { key: 'descripcion', label: 'Descripcion', type: 'text' },
    { key: 'precio', label: 'Precio', type: 'number' },
    { key: 'stockActual', label: 'Stock Actual', type: 'number' },
    { key: 'stockMinimo', label: 'Stock Minimo', type: 'number' },
    { key: 'marca', label: 'Marca', type: 'text' },
    { key: 'lineaProducto', label: 'Linea de Producto', type: 'text' },
    { key: 'esImportado', label: 'Es Importado', type: 'checkbox' },
  ],
};
