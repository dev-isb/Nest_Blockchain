"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PriceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const nodemailer = require("nodemailer");
const schedule_1 = require("@nestjs/schedule");
const price_1 = require("../models/price");
const alert_1 = require("../models/alert");
let PriceService = PriceService_1 = class PriceService {
    constructor() {
        this.logger = new common_1.Logger(PriceService_1.name);
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "salmanhameed454@gmail.com",
                pass: "nlcy tedo wcsk mpja",
            },
        });
    }
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
            const response = await axios_1.default.request(options);
            const data = response.data;
            await this.checkAlerts(data);
            const eth = data.find(x => x.name == 'Ethereum');
            const polygon = data.find(x => x.name == 'Polygon');
            const ethPrice = Number(eth.usd_price);
            const polygonPrice = Number(polygon.usd_price);
            await price_1.model.query().insert({ chain: 'Ethereum', price: ethPrice });
            await price_1.model.query().insert({ chain: 'Polygon', price: polygonPrice });
            this.checkPriceAlerts('Ethereum', ethPrice);
            this.checkPriceAlerts('Polygon', polygonPrice);
            return data;
        }
        catch (error) {
            this.logger.error('Error fetching prices:', error);
        }
    }
    async checkAlerts(currentData) {
        this.logger.log('Checking Alerts...');
        const alerts = await alert_1.alert.query();
        for (const alert of alerts) {
            const chain = currentData.find(x => x.name == alert.chain);
            if (!chain) {
                this.logger.log(`no data found for ${alert.chain}`);
                return;
            }
            const currentPrice = Number(chain.usd_price);
            if (currentPrice >= alert.targetPrice) {
                await this.sendEmailAlert(alert.email, alert.chain, currentPrice);
                this.logger.log(`Sent alert for ${alert.chain} to ${alert.email}`);
            }
        }
    }
    async checkPriceAlerts(chain, currentPrice) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const previousPrices = await price_1.model.query().select().where('chain', chain)
            .andWhere('createDt', '>', oneHourAgo)
            .orderBy('createDt', 'desc')
            .first();
        if (previousPrices) {
            const previousPrice = previousPrices.price;
            const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
            if (priceChange > 3) {
                this.sendEmail(chain, currentPrice, previousPrice);
            }
        }
    }
    async sendEmail(chain, currentPrice, previousPrice) {
        console.log("sending mail");
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'syed.hadi685@gmail.com',
            subject: `Price Alert for ${chain}`,
            text: `${chain} price increased from ${previousPrice} to ${currentPrice}.`,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent for ${chain}: ${previousPrice} -> ${currentPrice}`);
        }
        catch (error) {
            this.logger.error('Error sending email:', error);
        }
    }
    async sendEmailAlert(email, chain, price) {
        console.log("sending mail");
        return;
    }
    async getHourlyPrices(chain) {
        const prices = await price_1.model.query()
            .where('chain', chain)
            .orderBy('createDt', 'desc')
            .limit(24);
        return prices;
    }
    async getSwapRate(ethAmount) {
        const getData = await this.fetchPrices();
        const btc = getData.find(x => x.name == 'Bitcoin');
        const eth = getData.find(x => x.name == 'Ethereum');
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
    async setAlert(chain, targetPrice, email) {
        const rsp = await alert_1.alert.query().insert({
            chain,
            targetPrice,
            email,
        });
        return rsp;
    }
    async sendEmailTest() {
        await this.sendEmail("Polygon", 100, 50);
        return;
    }
};
exports.PriceService = PriceService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PriceService.prototype, "fetchPrices", null);
exports.PriceService = PriceService = PriceService_1 = __decorate([
    (0, common_1.Injectable)()
], PriceService);
//# sourceMappingURL=price.service.js.map