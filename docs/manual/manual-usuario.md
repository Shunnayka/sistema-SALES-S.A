# Manual de Usuario — SISTEMA_SALES

Este manual describe el uso funcional del sistema desde la perspectiva de un usuario final,
para los clientes web, escritorio (Electron) y movil (Expo). La interfaz de web y escritorio
es identica, ya que comparten el mismo codigo (ver `docs/cambios-documento.md`, Nota 9).

## 1. Inicio de sesion

Al abrir la aplicacion (web, escritorio o movil) se muestra una pantalla de login que pide
usuario y contrasena. Las credenciales por defecto son:

- Usuario: `admin`
- Contrasena: `admin1234`

Si las credenciales son incorrectas, se muestra un mensaje de error y se permanece en la
pantalla de login. Al iniciar sesion correctamente, el sistema guarda un token de sesion
(JWT) y navega al Panel principal.

## 2. Panel principal (Dashboard)

El panel principal muestra un resumen del estado del negocio:

- Cantidad total de productos registrados.
- Cantidad de productos que necesitan reabastecimiento (stock actual menor o igual al stock
  minimo definido para ese producto).
- Cantidad de facturas pendientes.
- Cantidad de ordenes de compra pendientes.
- Total facturado (sumatoria de facturas no anuladas).

Si existen productos con stock bajo, se muestra una tabla adicional con el detalle de cada
uno (ID, descripcion, stock actual y stock minimo).

En la version web/escritorio, la navegacion a cada modulo se realiza desde el menu lateral.
En la version movil, desde los botones "Ver Productos" y "Ver Facturas" del panel principal.

## 3. Modulos de mantenimiento (Distritos, Clientes, Proveedores, Vendedores)

Estos cuatro modulos comparten el mismo patron de uso (disponibles en web/escritorio; no
incluidos en el alcance reducido de la app movil):

1. La pantalla muestra una tabla con todos los registros existentes.
2. El boton "Nuevo" abre un formulario para crear un registro. Todos los campos marcados son
   obligatorios.
3. El boton "Editar" en una fila carga sus datos en el mismo formulario para modificarlos. El
   identificador no puede cambiarse durante la edicion.
4. El boton "Eliminar" borra el registro, previa confirmacion. Si el registro esta referenciado
   por otro (por ejemplo, un Distrito usado por un Cliente), la base de datos rechaza el borrado
   para mantener la integridad referencial.

Campos por modulo:

- **Distritos**: ID, descripcion.
- **Clientes**: ID, nombre/razon social, direccion, telefono, RUC (13 digitos), ID de distrito,
  fecha de registro, tipo de cliente, condicion (activo/inactivo).
- **Proveedores**: ID, razon social, direccion, telefono, ID de distrito, representante legal.
- **Vendedores**: ID, nombres, apellidos, sueldo, fecha de inicio, ID de distrito, tipo de
  vendedor.

## 4. Modulo de Productos

Ademas del alta, edicion y baja estandar (ver seccion 3), el modulo de Productos incluye un
panel de "Ajustar stock" independiente del formulario de edicion:

1. Se ingresa el ID del producto y una cantidad.
2. Una cantidad positiva incrementa el stock actual; una cantidad negativa lo reduce.
3. El sistema rechaza el ajuste si el resultado dejaria el stock en un valor negativo.

Este ajuste queda registrado inmediatamente y se refleja tanto en la tabla de productos como
en el panel principal (si el producto cae por debajo de su stock minimo).

## 5. Modulo de Facturas (Registrar Venta)

El boton "Registrar venta" abre un formulario con:

- Numero de factura, ID de cliente, ID de vendedor, porcentaje de IVA.
- Una o mas lineas de detalle (ID de producto, cantidad, precio de venta), con botones para
  agregar o quitar lineas.

Al confirmar, el sistema:

1. Verifica que cada producto exista y tenga stock suficiente.
2. Descuenta el stock vendido de cada producto.
3. Crea la factura en estado "pendiente" y calcula su total (subtotal de cada linea mas el
   IVA).

Sobre una factura pendiente, la tabla ofrece dos acciones:

- **Cancelar**: marca la factura como "cancelada" y registra la fecha de cancelacion. Solo
  aplica a facturas pendientes.
- **Anular**: marca la factura como "anulada". No aplica sobre facturas ya canceladas.

## 6. Modulo de Ordenes de Compra (Registrar Orden)

El boton "Registrar orden" abre un formulario con:

- Numero de orden, ID de proveedor.
- Una o mas lineas de detalle (ID de producto, cantidad solicitada).

Al confirmar, el sistema verifica que cada producto exista y crea la orden en estado
"pendiente". Sobre una orden pendiente, la tabla ofrece:

- **Atender**: marca la orden como "atendida" y registra la fecha de atencion.
- **Anular**: marca la orden como "anulada". No aplica sobre ordenes ya atendidas.

## 7. Cierre de sesion

El boton "Cerrar sesion" (menu lateral en web/escritorio, encabezado del panel en movil)
elimina el token guardado y regresa a la pantalla de login.

## 8. Mensajes de error comunes

- "No se pudo cargar la informacion": la API no respondio o el token expiro. Vuelva a iniciar
  sesion.
- "No se pudo guardar el registro. Verifique los datos.": algun campo no cumple las reglas de
  validacion (por ejemplo, un RUC que no tiene 13 digitos, o un sueldo menor o igual a cero).
- "No se pudo registrar la venta / la orden.": algun producto del detalle no existe, o no hay
  stock suficiente para completar la venta.
