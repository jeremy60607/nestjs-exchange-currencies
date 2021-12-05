import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ExchangeCurrencyQueryDTO } from './dto/currency.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { ExchangeCurrencyAO } from './ao/currency.ao';

@ApiTags('v1/currencies')
@Controller('v1/currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @ApiOkResponse({
    type: () => ExchangeCurrencyAO,
  })
  @Get('/exchange')
  exchangeCurrency(@Query() query: ExchangeCurrencyQueryDTO) {
    return this.currenciesService.exchangeCurrency(query);
  }
}
