import { Injectable, Logger,OnModuleInit } from '@nestjs/common';

import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { Cron } from '@nestjs/schedule';
import {model} from '../models/price';
import {alert} from '../models/alert';

@Injectable()
export class PriceService implements OnModuleInit {
  // Sender Email and Password here.
  private readonly logger = new Logger(PriceService.name);
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL || "sample@gmail.com",
      pass: process.env.MAIL_PASSWORD || "sample@123",
    },
  });


  @Cron('*/5 * * * *')
  async fetchPrices() {
    this.logger.log('Fetching prices...');
    const options = {
      method: 'GET',
      url: 'https://deep-index.moralis.io/api/v2.2/market-data/global/market-cap',
      headers: {
        'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJhMDYyN2ZkLWFkMDYtNDIyYy1iNGYxLTQ2ZTEwNTY3ODhmNiIsIm9yZ0lkIjoiNDExMzMwIiwidXNlcklkIjoiNDIyNzA2IiwidHlwZUlkIjoiYmQ4MmIzNzUtMDIzNS00NmQzLWIzYWUtNDMzMDk2ZTcyZjMwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3Mjg2NTAxMDQsImV4cCI6NDg4NDQxMDEwNH0.M5yxJNq4nlt4oMt1Qqoy1qOYLn-h_i8QDgu3b_7V4PY',
      },
    };

    try {
      const response = await axios.request(options);
      const data = response.data;
      await this.checkAlerts(data);
        const eth = data.find(x => x.name =='Ethereum');
        const polygon = data.find(x => x.name =='Polygon')
      const ethPrice = Number(eth.usd_price); 
      const polygonPrice = Number(polygon.usd_price);
      await model.query().insert(
        { chain: 'Ethereum', price: ethPrice }
      );

      await model.query().insert(
        { chain: 'Polygon', price: polygonPrice }
    );

      this.checkPriceAlerts('Ethereum', ethPrice);
      this.checkPriceAlerts('Polygon', polygonPrice);

      return data
    } catch (error) {
      this.logger.error('Error fetching prices:', error);
    }
  }


  async onModuleInit(){
    this.logger.log('Service initialized, fetching prices once...');
    await this.fetchPrices();
  }


    private async checkAlerts(currentData){
        this.logger.log('Checking Alerts...');
        const alerts = await alert.query();
        for (const alert of alerts) {
            const chain = currentData.find(x => x.name == alert.chain);
            if(!chain){
                this.logger.log(`no data found for ${alert.chain}`)
                return;
            }
          const currentPrice = Number(chain.usd_price);
          if (currentPrice >= alert.targetPrice) {
            await this.sendEmailAlert(alert.email, alert.chain, currentPrice);
            this.logger.log(`Sent alert for ${alert.chain} to ${alert.email}`);
          }
    }
  }

  private async checkPriceAlerts(chain: string, currentPrice: number) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const previousPrices = await model.query().select().where('chain', chain)
    .andWhere('createDt', '>', oneHourAgo)
    .orderBy('createDt', 'asc')
    .first(); 


    if (previousPrices) {
      const previousPrice = previousPrices.price;
      const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;

      if (priceChange > 3) {
        this.sendEmail(chain, currentPrice, previousPrice);
      }
    }
  }

  private async sendEmail(chain: string, currentPrice: number, previousPrice: number) {
    console.log("sending mail");
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert for ${chain}`,
      text: `${chain} price increased from ${previousPrice} to ${currentPrice}.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent for ${chain}: ${previousPrice} -> ${currentPrice}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }

  private async sendEmailAlert(email: string,chain : string, price: number) {
    console.log("sending mail");
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Price Alert for ${chain}`,
       text: `${chain} has reached your target price of ${price}.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent for ${chain}: ${price}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }

  async getHourlyPrices(chain: string) {
    const prices = await model.query()
      .where('chain', chain)
      .orderBy('createDt', 'desc')
      .limit(24); 
      return prices;
  }


  async getSwapRate(ethAmount: number) {
    
    const getData = await this.fetchPrices()
    const btc = getData.find(x=>x.name=='Bitcoin');
    const eth = getData.find(x=>x.name=='Ethereum');
    const ethPrice = Number(eth.usd_price);
    const btcPrice = Number(btc.usd_price);
    const feePercentage = 0.03;

    const totalFeeEth = ethAmount * feePercentage;
    const totalFeeDollar = totalFeeEth * ethPrice; 
    const totalBtc = ethAmount / btcPrice;

    return {
        btcAmount: totalBtc,
        totalFee: {
            eth: totalFeeEth,
            dollar: totalFeeDollar,
            percentage: feePercentage * 100,
        },
    };
}

async setAlert(chain: string, targetPrice: number, email: string) {
    const rsp = await alert.query().insert({
      chain,
      targetPrice,
      email,
    });
    return rsp;
  }


  async sendEmailTest(){
    await this.sendEmail("Polygon",100,50);
    return;
  }
}


