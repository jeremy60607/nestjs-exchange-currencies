import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from './currencies.service';
import { ExchangeCurrencyQueryDTO } from './dto/currency.dto';
import { BadRequestException } from '@nestjs/common';
import { ExchangeRatePO } from './po/currency.po';
import { ExceptionConst } from '../const/exception.const';

const { COUNTRY_IS_INVALID, VALUE_IS_INVALID } = ExceptionConst;

describe('CurrenciesService', () => {
  let service: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesService],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('check inputCurrency is invalid', () => {
    const checkCountryFunction = () => {
      service.fetchExchangeRate('T', 'USD');
    };

    expect(checkCountryFunction).toThrow(BadRequestException);
    expect(checkCountryFunction).toThrow(COUNTRY_IS_INVALID);
  });

  it('check targetCurrency is invalid', () => {
    const checkCountryFunction = () => {
      service.fetchExchangeRate('TWD', 'U');
    };

    expect(checkCountryFunction).toThrow(BadRequestException);
    expect(checkCountryFunction).toThrow(COUNTRY_IS_INVALID);
  });

  it('fetchExchangeRate success', () => {
    const exchangeRatePO: ExchangeRatePO = { targetRate: 111.801 };

    expect(service.fetchExchangeRate('USD', 'JPY')).toEqual(exchangeRatePO);
  });

  it('exchangeValue success', () => {
    expect(service.exchangeValue(111.801, 222)).toEqual(24819.822);
  });

  it('exchangeValue fail', () => {
    const testFunction = () => {
      service.exchangeValue(0.0003, 0.002);
    };

    expect(testFunction).toThrow(BadRequestException);
    expect(testFunction).toThrow(VALUE_IS_INVALID);
  });

  it('addThousandsSeparatorAndRoundingDigits success', () => {
    expect(service.standardizeValue(31555125.8456)).toEqual('31,555,125.85');
    expect(service.standardizeValue(31555125.8446)).toEqual('31,555,125.84');
  });
});
