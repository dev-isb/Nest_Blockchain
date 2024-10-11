import { Model } from 'objection';
export declare class alert extends Model {
    static get tableName(): string;
    id: number;
    chain: string;
    targetPrice: number;
    email: string;
    createdAt: string;
}
