import { Column, Entity, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { chatEntity } from "./chat.entity";

@Entity('bot')
export class botEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    role: string;

    @Column()
    instructions: string;

    @Column({ nullable: true })
    photo: string;

    @OneToMany(() => chatEntity, (chat) => chat.bot)
    chat: chatEntity[];
}