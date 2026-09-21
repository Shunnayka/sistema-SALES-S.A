import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsInt, IsNotEmpty, IsString, Min, MaxLength, ValidateNested } from 'class-validator';

export class DetalleOrdenCompraInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idProducto: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  cantidadSolicitada: number;
}

export class RegistrarOrdenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  numeroOrden: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idProveedor: string;

  @ApiProperty({ type: [DetalleOrdenCompraInputDto] })
  @ValidateNested({ each: true })
  @Type(() => DetalleOrdenCompraInputDto)
  @ArrayMinSize(1)
  detalles: DetalleOrdenCompraInputDto[];
}
