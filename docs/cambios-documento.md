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
