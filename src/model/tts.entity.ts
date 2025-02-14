import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('TextToSpeech')
export class ttsEntity extends parentEntity {
    @Column()
    title: string;

    @Column()
    language: string

    @Column()
    tone: string

    @Column()
    description: string

    @Column()
    audio: string;

    @ManyToOne(() => userEntity, (user) => user.chat)
    user: userEntity;

}