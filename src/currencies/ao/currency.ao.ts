import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExchangeCurrencyAO {
  @Expose()
  @ApiProperty()
  rate: number;

  @Expose()
  @ApiProperty()
  currency: string;
}
