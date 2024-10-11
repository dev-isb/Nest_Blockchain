import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(), // Ensure this is included
  ],
  providers: [PriceService],
  controllers: [PriceController]
})
export class PriceModule {}
