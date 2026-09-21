import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DistritoModule } from './distrito/distrito.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { VendedorModule } from './vendedor/vendedor.module';
import { ProductoModule } from './producto/producto.module';
import { FacturaModule } from './factura/factura.module';
import { OrdenCompraModule } from './orden-compra/orden-compra.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DistritoModule,
    ClienteModule,
    ProveedorModule,
    VendedorModule,
    ProductoModule,
    FacturaModule,
    OrdenCompraModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
