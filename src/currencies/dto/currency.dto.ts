import { IsNumber, IsNumberString, IsString, Min, MIN } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeCurrencyQueryDTO {
  @IsString()
  @ApiProperty({
    description: '來源幣別',
    example: 'TWD',
  })
  inputCurrency: string;

  @IsString()
  @ApiProperty({
    description: '目標幣別',
    example: 'USD',
  })
  targetCurrency: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: '金額數字',
    example: '288887.1533',
  })
  value: number;
}
