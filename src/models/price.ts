import { Model } from 'objection';

export class model extends Model {
    static get tableName() {
        return 'price';
    }


    id!: number;
    chain!: string;
    price!: number;
    createDt!: Date;



}
