import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AjustarStockDto {
  @ApiProperty({ description: 'Positive to increase stock, negative to decrease it' })
  @IsInt()
  @IsNotEmpty()
  cantidad: number;
}
