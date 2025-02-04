import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('SpeechToText')
export class sttEntity extends parentEntity {
    @Column()
    audio: string;

    @Column()
    transcription: string;

    @ManyToOne(() => userEntity, (user) => user.stt)
    user: userEntity;

}