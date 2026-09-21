import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDistritoDto } from './create-distrito.dto';

export class UpdateDistritoDto extends PartialType(OmitType(CreateDistritoDto, ['idDistrito'] as const)) {}
