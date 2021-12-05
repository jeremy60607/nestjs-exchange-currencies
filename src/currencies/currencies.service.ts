import { BadRequestException, Injectable } from '@nestjs/common';
import { ExchangeCurrencyQueryDTO } from './dto/currency.dto';
import { ExchangeRatePO } from './po/currency.po';
import { plainToClass } from 'class-transformer';
import { ExchangeCurrencyAO } from './ao/currency.ao';
import { ExceptionConst } from '../const/exception.const';
import { evaluate } from 'mathjs';
const { COUNTRY_IS_INVALID, VALUE_IS_INVALID } = ExceptionConst;

@Injectable()
export class CurrenciesService {
  exchangeCurrency(dto: ExchangeCurrencyQueryDTO): ExchangeCurrencyAO {
    const { inputCurrency, targetCurrency, value } = dto;

    const exchangeRatePO = this.fetchExchangeRate(
      inputCurrency,
      targetCurrency,
    );

    const exchangedValue = this.exchangeValue(exchangeRatePO.targetRate, value);

    const valueWithCurrencySeparators = this.standardizeValue(exchangedValue);

    return plainToClass(
      ExchangeCurrencyAO,
      {
        targetRate: exchangeRatePO.targetRate,
        targetCurrency,
        value: valueWithCurrencySeparators,
      },
      { excludeExtraneousValues: true },
    );
  }

  fetchExchangeRate(
    inputCurrency: string,
    targetCurrency: string,
  ): ExchangeRatePO {
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

    if (!currencies[inputCurrency]) {
      throw new BadRequestException(COUNTRY_IS_INVALID);
    }

    if (!currencies[inputCurrency][targetCurrency]) {
      throw new BadRequestException(COUNTRY_IS_INVALID);
    }

    const targetRate: number = currencies[inputCurrency][targetCurrency];

    return plainToClass(
      ExchangeRatePO,
      { targetRate },
      { excludeExtraneousValues: true },
    );
  }

  exchangeValue(exchangeRate: number, value: number): number {
    const exchangedValue = evaluate(`${exchangeRate} * ${value}`);

    if (!exchangedValue || !(exchangedValue >= 0.005)) {
      throw new BadRequestException(VALUE_IS_INVALID);
    }

    return exchangedValue;
  }

  standardizeValue(value: number): string {
    return value.toLocaleString([], {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
}
