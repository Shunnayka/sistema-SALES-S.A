# Cambios respecto al documento académico

Este archivo registra las diferencias entre el documento académico original y la
implementación real del sistema, para que puedan incorporarse en la próxima
actualización del documento.

## Nota 1: Versión de PostgreSQL

El documento académico especifica PostgreSQL 16. La implementación utiliza
PostgreSQL 18.6, que es la versión instalada en el entorno de desarrollo.
No hay impacto funcional: Prisma 6 y el script SQL de creación son compatibles
con ambas versiones.

## Nota 2: Formato de los diagramas UML

Los diagramas UML incluidos en el repositorio (`docs/diagrams/`) están
almacenados en formato PDF, no en formato PNG como se indica en el documento
académico original.

## Nota 3: Identificadores de entidades como Value Objects

Los identificadores de las entidades del dominio (ProductoId, ClienteId,
VendedorId, ProveedorId, DistritoId, NumeroFactura, DetalleFacturaId,
NumeroOrden, DetalleOrdenCompraId) se implementan como Value Objects
inmutables en lugar de tipos primitivos (string). Esta es una decisión de
diseño deliberada para reforzar la pureza del núcleo hexagonal: la validación
del identificador queda encapsulada en el propio Value Object en vez de
dispersarse en los servicios de aplicación o los adaptadores.

## Nota 4: Firmas asíncronas (Promise<T>) en los puertos

Las firmas de los puertos de entrada y salida descritas en el documento
académico (por ejemplo `ejecutar(datosFactura): Factura` o
`buscarPorId(id): Producto`) son pseudocódigo de estilo UML. En la
implementación, todos los métodos de los puertos retornan `Promise<T>`, ya
que la Fase 2 conecta estos puertos con Prisma y PostgreSQL, cuyas
operaciones son intrínsecamente asíncronas. Esta decisión evita una
refactorización posterior y no representa un cambio de arquitectura, solo
una adecuación de las firmas a un caso de uso real con acceso a base de
datos.

## Nota 5: Mappers como costura entre Value Objects y claves compuestas de Prisma

Prisma no tiene un concepto nativo de Value Object ni de identificador
compuesto como objeto de dominio: solo entiende columnas y claves primarias
compuestas (`@@id([...])`). Para que esta limitación técnica no se filtre
al núcleo hexagonal, la Fase 2 introduce una clase *Mapper* por cada
adaptador (`ProductoMapper`, `FacturaMapper`, `OrdenCompraMapper`) que actúa
como costura entre ambos mundos: convierte las entidades y Value Objects del
dominio (incluyendo los identificadores compuestos `DetalleFacturaId` y
`DetalleOrdenCompraId`) hacia las filas y claves compuestas que Prisma
espera, y viceversa. Los adaptadores (`PostgresProductoAdapter`,
`PostgresFacturaAdapter`, `PostgresOrdenCompraAdapter`) delegan esta
conversión en el mapper correspondiente y nunca exponen tipos de Prisma
fuera de la capa de persistencia.

## Nota 6: Autenticacion JWT basica sin entidad Usuario

El modelo de dominio no define una entidad Usuario ni un mecanismo de
credenciales propio. Dado el requisito "Authentication: JWT from Phase 3
(basic)" y la urgencia de entrega, la Fase 3 implementa un login unico
(POST /auth/login) validado contra un usuario y contrasena administrativos
tomados de variables de entorno (ADMIN_USER, ADMIN_PASSWORD), que emite un
JWT firmado con JWT_SECRET. Todos los endpoints salvo /auth/login exigen
este token (guard global). Esto demuestra el mecanismo de autenticacion
requerido sin construir un modulo de gestion de usuarios fuera del alcance
definido; se deja anotado como candidato a extender (tabla de usuarios con
contrasenas hasheadas) si el documento academico lo requiere.

## Nota 7: CRUD directo con Prisma para Distrito, Cliente, Proveedor y Vendedor

El nucleo hexagonal solo define puertos de salida para Producto, Factura y
OrdenCompra (segun el modelo de dominio original). Distrito, Cliente,
Proveedor y Vendedor no tienen casos de uso ni puertos propios definidos.
Para exponer "endpoints funcionales para todas las entidades" en la Fase 3
sin ampliar el alcance ya acordado del nucleo, sus controladores REST usan
el cliente Prisma de @sistema-sales/persistence directamente para las
operaciones CRUD. Producto, Factura y OrdenCompra, en cambio, enrutan sus
operaciones de negocio (registrar venta, ajustar stock, gestionar
abastecimiento) a traves de los servicios de aplicacion del nucleo
(VentaService, InventarioService, AbastecimientoService), preservando las
invariantes de dominio donde el modelo original las definio.

## Nota 8: Serializacion JSON de las entidades (toJSON)

Las entidades del nucleo exponen un metodo toJSON() que aplana su
identificador (Value Object) y el de sus referencias a un valor primitivo
(por ejemplo, `idProducto` en lugar de `id: { value: "P001" }"). Sin este
metodo, `JSON.stringify` serializaba la estructura interna del Value
Object, lo cual habria obligado a cada cliente (desktop, web, mobile) a
conocer esa forma anidada. Mantener la conversion en el propio nucleo evita
repetir esa logica de mapeo tres veces en la capa de presentacion.

## Nota 9: Un unico codigo React reutilizado por Web y Desktop

Ante la fecha limite de entrega, se decidio (con aprobacion explicita del
usuario) construir una sola aplicacion React + Vite en packages/web que
contiene todas las paginas, componentes y logica de conexion a la API REST.
packages/desktop (Electron) no duplica esta interfaz: su proceso principal
simplemente carga esa misma aplicacion (el servidor de desarrollo de Vite
en modo desarrollo, o el build estatico de packages/web/dist en modo
empaquetado) dentro de una ventana nativa. Esto satisface el requisito de
"reutilizacion de componentes" de la Fase 5 y evita construir dos interfaces
graficas independientes bajo una ventana de tiempo muy reducida. La
aplicacion movil (React Native + Expo) si requiere una reescritura de UI
propia, ya que React Native no renderiza componentes DOM de React web.

## Nota 10: Empaquetado de Electron configurado pero no ejecutado

packages/desktop incluye configuracion de electron-builder (appId,
productName, targets para Windows/Linux/macOS) en package.json, cumpliendo
el punto "packaging" de la Fase 4. Dada la ventana de tiempo de entrega, no
se genero el instalador real (electron-builder descarga binarios
adicionales por plataforma y puede tardar varios minutos); la aplicacion se
verifico funcional ejecutandola directamente con Electron (`npm start`),
que carga el mismo build estatico de packages/web que usaria el
instalador. Generar el instalador queda como un `npm run package` pendiente
de ejecutar cuando el tiempo lo permita.

## Nota 11: Verificacion de la app movil sin dispositivo fisico ni emulador

El entorno de esta sesion no tiene un emulador Android/iOS ni Expo Go
disponibles para probar packages/mobile visualmente. La app se verifico
de dos formas: `tsc --noEmit` (sin errores de tipos) y `npx expo export
--platform android`, que ejecuta el bundler Metro real sobre todo el
arbol de dependencias (788 modulos) y genera el bundle .hbc de Android sin
errores, confirmando que las pantallas, la navegacion y el cliente HTTP
resuelven correctamente. Esto no reemplaza una prueba visual en un
dispositivo real, que queda pendiente para el instructor o el autor.

Al configurar el monorepo con npm workspaces se detecto que
`node_modules/expo/AppEntry.js` (el entry point por defecto de Expo) asume
una instalacion local no compartida de `expo`, y falla cuando npm eleva
("hoists") el paquete a la raiz del monorepo, como ocurre aqui. La solucion
fue reemplazar el campo "main" de packages/mobile/package.json por un
index.js propio que importa App.tsx explicitamente, el patron recomendado
por Expo para entry points personalizados.

## Nota 12: Restricciones CHECK agregadas en una segunda migracion

Prisma 6 (API estable) no permite declarar restricciones CHECK dentro de
schema.prisma. La migracion inicial generada por Prisma (20260921171513_init)
solo incluye PK, FK, NOT NULL, longitudes VARCHAR y el UNIQUE de
cliente.ruc. Para que la base de datos real coincida con el diccionario de
datos 3NF documentado en docs/sql/schema.sql, se agrego una segunda
migracion escrita a mano (20260921175208_add_check_constraints) con las
sentencias ALTER TABLE ... ADD CONSTRAINT ... CHECK correspondientes a cada
restriccion del modelo (condicion_cliente, sueldo, precio, stock_actual,
stock_minimo, estado de factura y orden_compra, cantidad, precio_venta,
cantidad_solicitada). Estas restricciones ya estan aplicadas en la base de
datos local. La validacion de las mismas reglas tambien existe en la capa
de dominio (@sistema-sales/core), de modo que la aplicacion falla con un
mensaje claro antes de llegar a la base de datos; el CHECK a nivel de SQL
es una segunda linea de defensa fiel al modelo entidad-relacion original.

