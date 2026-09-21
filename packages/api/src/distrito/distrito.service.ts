import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT } from '../prisma/prisma.module';
import { CreateDistritoDto } from './dto/create-distrito.dto';
import { UpdateDistritoDto } from './dto/update-distrito.dto';

@Injectable()
export class DistritoService {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  public findAll() {
    return this.prisma.distrito.findMany({ orderBy: { idDistrito: 'asc' } });
  }

  public async findOne(idDistrito: string) {
    const distrito = await this.prisma.distrito.findUnique({ where: { idDistrito } });

    if (!distrito) {
      throw new NotFoundException(`Distrito ${idDistrito} not found`);
    }

    return distrito;
  }

  public create(dto: CreateDistritoDto) {
    return this.prisma.distrito.create({ data: dto });
  }

  public async update(idDistrito: string, dto: UpdateDistritoDto) {
    await this.findOne(idDistrito);

    return this.prisma.distrito.update({ where: { idDistrito }, data: dto });
  }

  public async remove(idDistrito: string) {
    await this.findOne(idDistrito);
    await this.prisma.distrito.delete({ where: { idDistrito } });
  }
}
