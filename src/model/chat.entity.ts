import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('chat')
export class chatEntity extends parentEntity {
    @Column()
    prompt: string;

    @Column()
    response: string;

    @ManyToOne(() => userEntity, (user) => user.chat)
    user: userEntity;

}