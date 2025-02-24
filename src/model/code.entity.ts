import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('code')
export class codeEntity extends parentEntity {

    @Column()
    title: string;

    @Column()
    language: string;

    @Column()
    description: string;

    @Column()
    code: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.code)
    user: userEntity;

}