import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";
import { sessionEntity } from "./session.entity";

@Entity('chat')
export class chatEntity extends parentEntity {

    @Column()
    prompt: string;

    @Column()
    response: string;

    @ManyToOne(() => userEntity, (user) => user.chats, { onDelete: 'CASCADE' })
    user: userEntity;

    @ManyToOne(() => sessionEntity, (session) => session.chats, { onDelete: 'CASCADE' })
    session: sessionEntity;


}