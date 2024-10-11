import { PriceService } from './price.service';
export declare class PriceController {
    private readonly priceService;
    constructor(priceService: PriceService);
    getHourlyPrices(chain: string): Promise<import("../models/price").model[]>;
    getSwapRate(ethAmount: number): Promise<{
        btcAmount: number;
        totalFee: {
            eth: number;
            dollar: number;
            percentage: number;
        };
    }>;
    setAlert(chain: string, targetPrice: number, email: string): Promise<import("../models/alert").alert>;
    sendEmail(): Promise<void>;
}
