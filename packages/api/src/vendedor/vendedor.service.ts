import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { UpdateVendedorDto } from './dto/update-vendedor.dto';

@Injectable()
export class VendedorService {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  public findAll() {
    return this.prisma.vendedor.findMany({ orderBy: { idVendedor: 'asc' } });
  }

  public async findOne(idVendedor: string) {
    const vendedor = await this.prisma.vendedor.findUnique({ where: { idVendedor } });

    if (!vendedor) {
      throw new NotFoundException(`Vendedor ${idVendedor} not found`);
    }

    return vendedor;
  }

  public create(dto: CreateVendedorDto) {
    return this.prisma.vendedor.create({
      data: { ...dto, fechaInicio: new Date(dto.fechaInicio) },
    });
  }

  public async update(idVendedor: string, dto: UpdateVendedorDto) {
    await this.findOne(idVendedor);

    return this.prisma.vendedor.update({
      where: { idVendedor },
      data: { ...dto, fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined },
    });
  }

  public async remove(idVendedor: string) {
    await this.findOne(idVendedor);
    await this.prisma.vendedor.delete({ where: { idVendedor } });
  }
}
