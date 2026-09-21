import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProveedorDto } from './create-proveedor.dto';

export class UpdateProveedorDto extends PartialType(OmitType(CreateProveedorDto, ['idProveedor'] as const)) {}
