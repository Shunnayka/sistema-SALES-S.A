import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsNumber, IsString, Min, MaxLength, ValidateNested } from 'class-validator';

export class DetalleFacturaInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idProducto: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precioVenta: number;
}

export class RegistrarVentaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  numeroFactura: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idCliente: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idVendedor: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  porcentajeIva: number;

  @ApiProperty({ type: [DetalleFacturaInputDto] })
  @ValidateNested({ each: true })
  @Type(() => DetalleFacturaInputDto)
  @ArrayMinSize(1)
  detalles: DetalleFacturaInputDto[];
}
