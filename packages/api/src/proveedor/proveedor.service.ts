import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  public findAll() {
    return this.prisma.proveedor.findMany({ orderBy: { idProveedor: 'asc' } });
  }

  public async findOne(idProveedor: string) {
    const proveedor = await this.prisma.proveedor.findUnique({ where: { idProveedor } });

    if (!proveedor) {
      throw new NotFoundException(`Proveedor ${idProveedor} not found`);
    }

    return proveedor;
  }

  public create(dto: CreateProveedorDto) {
    return this.prisma.proveedor.create({ data: dto });
  }

  public async update(idProveedor: string, dto: UpdateProveedorDto) {
    await this.findOne(idProveedor);

    return this.prisma.proveedor.update({ where: { idProveedor }, data: dto });
  }

  public async remove(idProveedor: string) {
    await this.findOne(idProveedor);
    await this.prisma.proveedor.delete({ where: { idProveedor } });
  }
}
