import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { packageEntity } from "./package.entity";
import { packagePaymentEntity } from "./packagePayment.entity";
import { userEntity } from "./user.entity";

@Entity('subscription')
export class subscriptionEntity extends parentEntity {
    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => userEntity, (user) => user.subscription)
    user: userEntity;

    @ManyToOne(() => packageEntity, (pckg) => pckg.subscription)
    package: packageEntity;

    @OneToOne(() => packagePaymentEntity, (pkg) => pkg.subscription)
    @JoinColumn({ name: 'packagePaymentId' })
    packagePayment: packagePaymentEntity;
}