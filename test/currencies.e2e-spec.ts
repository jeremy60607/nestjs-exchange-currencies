import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CurrenciesModule } from '../src/currencies/currencies.module';
import { ExchangeCurrencyBodyDTO } from '../src/currencies/dto/currency.dto';
import { ExchangeCurrencyAO } from '../src/currencies/ao/currency.ao';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CurrenciesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/currencies/exchange', () => {
    const dto: ExchangeCurrencyBodyDTO = {
      country: 'TWD',
      exchangeCountry: 'USD',
      currency: 31555125.8456,
    };

    const ao: ExchangeCurrencyAO = {
      rate: 0.03281,
      currency: '1,035,323.68',
    };

    return request(app.getHttpServer())
      .put('/v1/currencies/exchange')
      .send(dto)
      .expect(200)
      .expect(ao);
  });
});
