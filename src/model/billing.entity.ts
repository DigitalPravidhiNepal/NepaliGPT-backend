import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { parentEntity } from '.';
import { billPaymentEntity } from './billPayment.entity';
import { billingStatus } from 'src/helper/types/index.type';

@Entity('billing')
export class billingEntity extends parentEntity {
  @Column()
  totalPaidAmount: number;

  @Column({ default: 0 })
  discount: number;

  @Column()
  status: billingStatus;

  @OneToMany(() => billPaymentEntity, (payment) => payment.billing, {
    onDelete: 'CASCADE',
  })
  payment: billPaymentEntity[];
}