import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  idCliente: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreRazonSocial: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  direccion: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  telefono: string;

  @ApiProperty()
  @Matches(/^\d{13}$/, { message: 'ruc must be exactly 13 digits' })
  ruc: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  idDistrito: string;

  @ApiProperty()
  @IsDateString()
  fechaRegistro: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  tipoCliente: string;

  @ApiProperty({ enum: ['activo', 'inactivo'] })
  @IsIn(['activo', 'inactivo'])
  condicionCliente: 'activo' | 'inactivo';
}
