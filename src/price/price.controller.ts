import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly/:chain')
  @ApiOperation({ summary: 'Get hourly prices for a given chain' })
  @ApiParam({ name: 'chain', description: 'The name of the blockchain (e.g., Ethereum, Bitcoin)' })
  @ApiResponse({ status: 200, description: 'Hourly prices retrieved successfully' })
  async getHourlyPrices(@Param('chain') chain: string) {
    return this.priceService.getHourlyPrices(chain);
  }

  @Get('swap-rate')
  @ApiOperation({ summary: 'Get the swap rate for a given amount of ETH' })
  @ApiQuery({ name: 'ethAmount', description: 'The amount of ETH to swap', example: 1 })
  @ApiResponse({ status: 200, description: 'Swap rate retrieved successfully' })
  async getSwapRate(@Query('ethAmount') ethAmount: number) {
    return this.priceService.getSwapRate(ethAmount);
  }

  @Post('alert')
  @ApiOperation({ summary: 'Set an alert for a target price of a given chain' })
  @ApiBody({
    description: 'Set alert body',
    schema: {
      type: 'object',
      properties: {
        chain: { type: 'string', example: 'Ethereum', description: 'Blockchain name' },
        targetPrice: { type: 'number', example: 3000, description: 'Target price to set an alert' },
        email: { type: 'string', example: 'example@example.com', description: 'Email address for alert' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Alert set successfully' })
  async setAlert(
    @Body('chain') chain: string,
    @Body('targetPrice') targetPrice: number,
    @Body('email') email: string
  ) {
    return this.priceService.setAlert(chain, targetPrice, email);
  }

  @Get('mail')
  @ApiOperation({ summary: 'Send a test email' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  async sendEmail() {
    return this.priceService.sendEmailTest();
  }
}
