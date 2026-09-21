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
