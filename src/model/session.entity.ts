import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { chatEntity } from "./chat.entity";
import { userEntity } from "./user.entity";

@Entity('session')
export class sessionEntity extends parentEntity {

    @Column({ nullable: true })
    title: string; // Chat session title

    @ManyToOne(() => userEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
    user: userEntity;

    @OneToMany(() => chatEntity, (chat) => chat.session, { cascade: ['remove'], onDelete: 'CASCADE' })
    chats: chatEntity[];


}