import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { InventarioService, Producto, ProductoId } from '@sistema-sales/core';
import { PostgresProductoAdapter, ProductoMapper } from '@sistema-sales/persistence';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { AjustarStockDto } from './dto/ajustar-stock.dto';

@Injectable()
export class ProductoService {
  private readonly productoRepository: PostgresProductoAdapter;
  private readonly inventarioService: InventarioService;

  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {
    this.productoRepository = new PostgresProductoAdapter(prisma);
    this.inventarioService = new InventarioService(this.productoRepository);
  }

  public async findAll() {
    const rows = await this.prisma.producto.findMany({ orderBy: { idProducto: 'asc' } });

    return rows.map((row) => ProductoMapper.toDomain(row));
  }

  public async findOne(idProducto: string) {
    const producto = await this.productoRepository.buscarPorId(ProductoId.create(idProducto));

    if (!producto) {
      throw new NotFoundException(`Producto ${idProducto} not found`);
    }

    return producto;
  }

  public async create(dto: CreateProductoDto) {
    const producto = Producto.create({
      id: ProductoId.create(dto.idProducto),
      descripcion: dto.descripcion,
      precio: dto.precio,
      stockActual: dto.stockActual,
      stockMinimo: dto.stockMinimo,
      marca: dto.marca,
      lineaProducto: dto.lineaProducto,
      esImportado: dto.esImportado ?? false,
    });

    await this.productoRepository.guardar(producto);

    return producto;
  }

  public async update(idProducto: string, dto: UpdateProductoDto) {
    const existing = await this.findOne(idProducto);

    const producto = Producto.create({
      id: existing.getId(),
      descripcion: dto.descripcion ?? existing.getDescripcion(),
      precio: dto.precio ?? existing.getPrecio(),
      stockActual: existing.getStockActual(),
      stockMinimo: dto.stockMinimo ?? existing.getStockMinimo(),
      marca: dto.marca ?? existing.getMarca(),
      lineaProducto: dto.lineaProducto ?? existing.getLineaProducto(),
      esImportado: dto.esImportado ?? existing.getEsImportado(),
    });

    await this.productoRepository.guardar(producto);

    return producto;
  }

  public async ajustarStock(idProducto: string, dto: AjustarStockDto) {
    await this.inventarioService.ejecutar(ProductoId.create(idProducto), dto.cantidad);

    return this.findOne(idProducto);
  }

  public async remove(idProducto: string) {
    await this.findOne(idProducto);
    await this.prisma.producto.delete({ where: { idProducto } });
  }
}
