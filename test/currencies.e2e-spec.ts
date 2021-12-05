import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CurrenciesModule } from '../src/currencies/currencies.module';
import { ExchangeCurrencyQueryDTO } from '../src/currencies/dto/currency.dto';
import { ExchangeCurrencyAO } from '../src/currencies/ao/currency.ao';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CurrenciesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
  });

  it('/v1/currencies/exchange', () => {
    const exchangeCurrencyQuery: ExchangeCurrencyQueryDTO = {
      inputCurrency: 'TWD',
      targetCurrency: 'USD',
      value: 31555125.8456,
    };

    const exchangeCurrency: ExchangeCurrencyAO = {
      targetCurrency: 'USD',
      targetRate: 0.03281,
      value: '1,035,323.68',
    };

    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query(exchangeCurrencyQuery)
      .expect(200)
      .expect(exchangeCurrency);
  });

  it('check value negative', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        inputCurrency: 'USD',
        targetCurrency: 123,
        value: -31555125.8456,
      })
      .expect(400);
  });

  it('check value is number', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        inputCurrency: 'USD',
        targetCurrency: 123,
        value: '31555125.8456',
      })
      .expect(400);
  });

  it('check targetCurrency is not string', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        inputCurrency: 'USD',
        targetCurrency: 123,
        value: 31555125.8456,
      })
      .expect(400);
  });

  it('check inputCurrency is not string', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        inputCurrency: 123,
        targetCurrency: 'USD',
        value: 31555125.8456,
      })
      .expect(400);
  });

  it('check inputCurrency is empty', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        targetCurrency: 'USD',
        value: 31555125.8456,
      })
      .expect(400);
  });

  it('check targetCurrency is empty', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        inputCurrency: 'USD',
        value: 31555125.8456,
      })
      .expect(400);
  });

  it('check value is empty', () => {
    return request(app.getHttpServer())
      .get('/v1/currencies/exchange')
      .query({
        targetCurrency: 'USD',
        inputCurrency: 'USD',
      })
      .expect(400);
  });
});
