import { model } from '../models/price';
import { alert } from '../models/alert';
export declare class PriceService {
    private readonly logger;
    private transporter;
    fetchPrices(): Promise<any>;
    private checkAlerts;
    private checkPriceAlerts;
    private sendEmail;
    private sendEmailAlert;
    getHourlyPrices(chain: string): Promise<model[]>;
    getSwapRate(ethAmount: number): Promise<{
        btcAmount: number;
        totalFee: {
            eth: number;
            dollar: number;
            percentage: number;
        };
    }>;
    setAlert(chain: string, targetPrice: number, email: string): Promise<alert>;
    sendEmailTest(): Promise<void>;
}
