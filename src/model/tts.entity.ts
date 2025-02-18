import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('TextToSpeech')
export class ttsEntity extends parentEntity {
    @Column()
    text: string;

    @Column()
    audio: string;

    @ManyToOne(() => userEntity, (user) => user.chat)
    user: userEntity;

}