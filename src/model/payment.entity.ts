import { Column, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

export class paymentEntity extends parentEntity {
    @Column({ default: false })
    payment: boolean;

    @Column()
    amount: number;

    @ManyToOne(() => userEntity, (user) => user.payments)
    user: userEntity;
}