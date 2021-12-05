import { BadRequestException, Injectable } from '@nestjs/common';
import { ExchangeCurrencyBodyDTO } from './dto/currency.dto';
import { ExchangeRatePO } from './po/currency.po';
import { plainToClass } from 'class-transformer';
import { ExchangeCurrencyAO } from './ao/currency.ao';
import { ExceptionConst } from '../const/exception.const';

@Injectable()
export class CurrenciesService {
  exchangeCurrency(dto: ExchangeCurrencyBodyDTO): ExchangeCurrencyAO {
    const { country, exchangeCountry, currency } = dto;

    const exchangeRatePO = this.fetchExchangeRate(country, exchangeCountry);

    const exchangeCurrency = this.calculateCurrency(
      exchangeRatePO.rate,
      currency,
    );

    const currencyWithThousandsSeparator =
      this.addThousandsSeparatorAndRoundingDigits(exchangeCurrency);

    return plainToClass(
      ExchangeCurrencyAO,
      { rate: exchangeRatePO.rate, currency: currencyWithThousandsSeparator },
      { excludeExtraneousValues: true },
    );
  }

  fetchExchangeRate(country: string, exchangeCountry: string): ExchangeRatePO {
    // fetch exchange rate from ThirdParty API
    const currencies = {
      TWD: {
        TWD: 1,
        JPY: 3.669,
        USD: 0.03281,
      },
      JPY: {
        TWD: 0.26956,
        JPY: 1,
        USD: 0.00885,
      },
      USD: {
        TWD: 30.444,
        JPY: 111.801,
        USD: 1,
      },
    };

    const { COUNTRY_IS_INVALID } = ExceptionConst;

    if (!currencies[country]) {
      throw new BadRequestException(COUNTRY_IS_INVALID);
    }

    if (!currencies[country][exchangeCountry]) {
      throw new BadRequestException(COUNTRY_IS_INVALID);
    }

    const rate: number = currencies[country][exchangeCountry];

    return plainToClass(
      ExchangeRatePO,
      { rate },
      { excludeExtraneousValues: true },
    );
  }

  calculateCurrency(exchangeRate: number, currency: number): number {
    return exchangeRate * currency;
  }

  addThousandsSeparatorAndRoundingDigits(currency: number): string {
    return currency.toLocaleString([], {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
}
