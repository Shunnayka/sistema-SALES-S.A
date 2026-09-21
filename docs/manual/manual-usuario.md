# Manual de Usuario — SISTEMA_SALES

Este manual describe el uso funcional del sistema desde la perspectiva de un usuario final,
para los clientes web, escritorio (Electron) y móvil (Expo). La interfaz de web y escritorio
es idéntica, ya que comparten el mismo código (ver `docs/cambios-documento.md`, Nota 9).

## 1. Inicio de sesión

Al abrir la aplicación (web, escritorio o móvil) se muestra una pantalla de login que pide
usuario y contraseña. Las credenciales por defecto son:

- Usuario: `admin`
- Contraseña: `admin1234`

Si las credenciales son incorrectas, se muestra un mensaje de error y se permanece en la
pantalla de login. Al iniciar sesión correctamente, el sistema guarda un token de sesión
(JWT) y navega al Panel principal.

## 2. Panel principal (Dashboard)

El panel principal muestra un resumen del estado del negocio:

- Cantidad total de productos registrados.
- Cantidad de productos que necesitan reabastecimiento (stock actual menor o igual al stock
  mínimo definido para ese producto).
- Cantidad de facturas pendientes.
- Cantidad de órdenes de compra pendientes.
- Total facturado (sumatoria de facturas no anuladas).

Si existen productos con stock bajo, se muestra una tabla adicional con el detalle de cada
uno (ID, descripción, stock actual y stock mínimo).

En la versión web/escritorio, la navegación a cada módulo se realiza desde el menú lateral.
En la versión móvil, desde los botones "Ver Productos" y "Ver Facturas" del panel principal.

## 3. Módulos de mantenimiento (Distritos, Clientes, Proveedores, Vendedores)

Estos cuatro módulos comparten el mismo patrón de uso (disponibles en web/escritorio; no
incluidos en el alcance reducido de la app móvil):

1. La pantalla muestra una tabla con todos los registros existentes.
2. El botón "Nuevo" abre un formulario para crear un registro. Todos los campos marcados son
   obligatorios.
3. El botón "Editar" en una fila carga sus datos en el mismo formulario para modificarlos. El
   identificador no puede cambiarse durante la edición.
4. El botón "Eliminar" borra el registro, previa confirmación. Si el registro está referenciado
   por otro (por ejemplo, un Distrito usado por un Cliente), la base de datos rechaza el borrado
   para mantener la integridad referencial.

Campos por módulo:

- **Distritos**: ID, descripción.
- **Clientes**: ID, nombre/razón social, dirección, teléfono, RUC (13 dígitos), ID de distrito,
  fecha de registro, tipo de cliente, condición (activo/inactivo).
- **Proveedores**: ID, razón social, dirección, teléfono, ID de distrito, representante legal.
- **Vendedores**: ID, nombres, apellidos, sueldo, fecha de inicio, ID de distrito, tipo de
  vendedor.

## 4. Módulo de Productos

Además del alta, edición y baja estándar (ver sección 3), el módulo de Productos incluye un
panel de "Ajustar stock" independiente del formulario de edición:

1. Se ingresa el ID del producto y una cantidad.
2. Una cantidad positiva incrementa el stock actual; una cantidad negativa lo reduce.
3. El sistema rechaza el ajuste si el resultado dejaría el stock en un valor negativo.

Este ajuste queda registrado inmediatamente y se refleja tanto en la tabla de productos como
en el panel principal (si el producto cae por debajo de su stock mínimo).

## 5. Módulo de Facturas (Registrar Venta)

El botón "Registrar venta" abre un formulario con:

- Número de factura, ID de cliente, ID de vendedor, porcentaje de IVA.
- Una o más líneas de detalle (ID de producto, cantidad, precio de venta), con botones para
  agregar o quitar líneas.

Al confirmar, el sistema:

1. Verifica que cada producto exista y tenga stock suficiente.
2. Descuenta el stock vendido de cada producto.
3. Crea la factura en estado "pendiente" y calcula su total (subtotal de cada línea más el
   IVA).

Sobre una factura pendiente, la tabla ofrece dos acciones:

- **Cancelar**: marca la factura como "cancelada" y registra la fecha de cancelación. Solo
  aplica a facturas pendientes.
- **Anular**: marca la factura como "anulada". No aplica sobre facturas ya canceladas.

## 6. Módulo de Órdenes de Compra (Registrar Orden)

El botón "Registrar orden" abre un formulario con:

- Número de orden, ID de proveedor.
- Una o más líneas de detalle (ID de producto, cantidad solicitada).

Al confirmar, el sistema verifica que cada producto exista y crea la orden en estado
"pendiente". Sobre una orden pendiente, la tabla ofrece:

- **Atender**: marca la orden como "atendida" y registra la fecha de atención.
- **Anular**: marca la orden como "anulada". No aplica sobre órdenes ya atendidas.

## 7. Cierre de sesión

El botón "Cerrar sesión" (menú lateral en web/escritorio, encabezado del panel en móvil)
elimina el token guardado y regresa a la pantalla de login.

## 8. Mensajes de error comunes

- "No se pudo cargar la información": la API no respondió o el token expiró. Vuelva a iniciar
  sesión.
- "No se pudo guardar el registro. Verifique los datos.": algún campo no cumple las reglas de
  validación (por ejemplo, un RUC que no tiene 13 dígitos, o un sueldo menor o igual a cero).
- "No se pudo registrar la venta / la orden.": algún producto del detalle no existe, o no hay
  stock suficiente para completar la venta.

## 9. Configuración de la API en la app móvil

La app móvil lee la URL de la API desde la variable de entorno `EXPO_PUBLIC_API_URL`. Si no se
define, usa `http://localhost:3000` por defecto.

| Entorno | Valor |
|---|---|
| Expo Web (navegador en la misma máquina) | `http://localhost:3000` (por defecto) |
| Simulador iOS | `http://localhost:3000` (por defecto) |
| Emulador Android | `http://10.0.2.2:3000` |
| Dispositivo físico (Expo Go) | `http://<IP-LAN-de-la-máquina>:3000` |

Para sobrescribir el valor por defecto:

PowerShell:
```powershell
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:3000"; npx expo start
```

Bash / macOS / Linux:
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000 npx expo start
```
