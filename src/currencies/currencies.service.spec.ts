import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from './currencies.service';
import { ExchangeCurrencyBodyDTO } from './dto/currency.dto';
import { BadRequestException } from '@nestjs/common';
import { ExchangeRatePO } from './po/currency.po';
import { ExceptionConst } from '../const/exception.const';

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

  it('check country is invalid', () => {
    const { COUNTRY_IS_INVALID } = ExceptionConst;
    const checkCountryFunction = () => {
      service.fetchExchangeRate('T', 'USD');
    };

    expect(checkCountryFunction).toThrow(BadRequestException);
    expect(checkCountryFunction).toThrow(COUNTRY_IS_INVALID);
  });

  it('check exchangeCountry is invalid', () => {
    const { COUNTRY_IS_INVALID } = ExceptionConst;
    const checkCountryFunction = () => {
      service.fetchExchangeRate('TWD', 'U');
    };

    expect(checkCountryFunction).toThrow(BadRequestException);
    expect(checkCountryFunction).toThrow(COUNTRY_IS_INVALID);
  });

  it('fetchExchangeRate success', () => {
    const po: ExchangeRatePO = { rate: 111.801 };

    expect(service.fetchExchangeRate('USD', 'JPY')).toEqual(po);
  });

  it('calculateCurrency success', () => {
    const po: ExchangeRatePO = { rate: 111.801 };

    expect(service.fetchExchangeRate('USD', 'JPY')).toEqual(po);
  });

  it('addThousandsSeparatorAndRoundingDigits success', () => {
    expect(
      service.addThousandsSeparatorAndRoundingDigits(31555125.8456),
    ).toEqual('31,555,125.85');
    expect(
      service.addThousandsSeparatorAndRoundingDigits(31555125.8446),
    ).toEqual('31,555,125.84');
  });
});
