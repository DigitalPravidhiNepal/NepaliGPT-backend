import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('pricing')
export class PricingEntity extends parentEntity {
    @Column({ default: 139.50 })
    exchangeRate: string;

    @Column({ default: 0.15 })
    totalTokenCost: string;
}