import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('payment')
export class paymentEntity extends parentEntity {
    @Column()
    amount: number;

    @Column({ default: false })
    payment: boolean;

    @ManyToOne(() => userEntity, (user) => user.payments)
    user: userEntity;
}