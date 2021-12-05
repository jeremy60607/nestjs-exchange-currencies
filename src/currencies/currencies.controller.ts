import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ExchangeCurrencyBodyDTO } from './dto/currency.dto';
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
  @Put('/exchange')
  exchangeCurrency(@Body() body: ExchangeCurrencyBodyDTO) {
    return this.currenciesService.exchangeCurrency(body);
  }
}
