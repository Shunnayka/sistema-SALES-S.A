import { Module } from '@nestjs/common';
import { DistritoController } from './distrito.controller';
import { DistritoService } from './distrito.service';

@Module({
  controllers: [DistritoController],
  providers: [DistritoService],
})
export class DistritoModule {}
