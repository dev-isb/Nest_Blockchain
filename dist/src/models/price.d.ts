import { Model } from 'objection';
export declare class model extends Model {
    static get tableName(): string;
    id: number;
    chain: string;
    price: number;
    createDt: Date;
}
