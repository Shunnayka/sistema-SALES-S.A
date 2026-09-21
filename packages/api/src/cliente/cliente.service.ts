import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  public findAll() {
    return this.prisma.cliente.findMany({ orderBy: { idCliente: 'asc' } });
  }

  public async findOne(idCliente: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { idCliente } });

    if (!cliente) {
      throw new NotFoundException(`Cliente ${idCliente} not found`);
    }

    return cliente;
  }

  public create(dto: CreateClienteDto) {
    return this.prisma.cliente.create({
      data: { ...dto, fechaRegistro: new Date(dto.fechaRegistro) },
    });
  }

  public async update(idCliente: string, dto: UpdateClienteDto) {
    await this.findOne(idCliente);

    return this.prisma.cliente.update({
      where: { idCliente },
      data: { ...dto, fechaRegistro: dto.fechaRegistro ? new Date(dto.fechaRegistro) : undefined },
    });
  }

  public async remove(idCliente: string) {
    await this.findOne(idCliente);
    await this.prisma.cliente.delete({ where: { idCliente } });
  }
}
