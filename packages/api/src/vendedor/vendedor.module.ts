import { Module } from '@nestjs/common';
import { VendedorController } from './vendedor.controller';
import { VendedorService } from './vendedor.service';

@Module({
  controllers: [VendedorController],
  providers: [VendedorService],
})
export class VendedorModule {}
