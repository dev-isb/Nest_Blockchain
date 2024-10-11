import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceModule } from './price/price.module';
import DbModule from './db/index.module'

@Module({
  imports: [
    ConfigModule.forRoot({  
      isGlobal: true
    
    })
    , PriceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log("making db connection");
        
    const dbConnection = new DbModule();  
    dbConnection.makeConnection();  
  }
}
