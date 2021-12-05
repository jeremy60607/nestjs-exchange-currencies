import { IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeCurrencyBodyDTO {
  @IsString()
  @ApiProperty()
  country: string;

  @IsString()
  @ApiProperty()
  exchangeCountry: string;

  @IsNumber()
  @ApiProperty()
  currency: number;
}
