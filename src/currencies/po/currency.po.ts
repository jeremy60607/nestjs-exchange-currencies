import { Expose } from 'class-transformer';

export class ExchangeRatePO {
  @Expose()
  targetRate: number;
}
