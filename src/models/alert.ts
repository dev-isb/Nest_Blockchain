import { Model } from 'objection';

export class alert extends Model {
    static get tableName() {
        return 'alert';
    }

    id!: number;
    chain!: string; 
    targetPrice!: number; 
    email!: string; 
    createdAt!: string;
}
