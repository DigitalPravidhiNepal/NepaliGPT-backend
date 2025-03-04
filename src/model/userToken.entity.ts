import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('User-token')
export class userTokenEntity extends parentEntity {

    @Column({ type: "int", default: 0 })
    totalTokens: number;

    @Column({ type: "int", default: 0 })
    usedTokens: number;

    @Column({ type: "int", default: 0 })
    remainingTokens: number;

    @OneToOne(() => userEntity, (user) => user.tokens)
    user: userEntity;

}