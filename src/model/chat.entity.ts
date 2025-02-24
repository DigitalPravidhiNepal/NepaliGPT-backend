import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";
import { botEntity } from "./bot.entity";

@Entity('chat')
export class chatEntity extends parentEntity {
    @Column()
    prompt: string;

    @Column()
    response: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.chat)
    user: userEntity;

    @ManyToOne(() => botEntity, (bot) => bot.chat)
    bot: botEntity;

}