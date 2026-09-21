import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  idProducto: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  descripcion: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  stockActual: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  stockMinimo: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  marca: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  lineaProducto: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  esImportado?: boolean;
}
