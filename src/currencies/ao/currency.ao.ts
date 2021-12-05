import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExchangeCurrencyAO {
  @ApiProperty({ description: '目標幣別' })
  @Expose()
  targetCurrency: string;

  @Expose()
  @ApiProperty({ description: '目標匯率' })
  targetRate: number;

  @Expose()
  @ApiProperty({ description: '轉換後金額' })
  value: string;
}
