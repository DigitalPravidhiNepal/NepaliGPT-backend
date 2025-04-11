import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('SpeechToText')
export class sttEntity extends parentEntity {

    @Column()
    title: string;

    @Column()
    audio: string;

    @Column()
    description: string;

    @Column()
    transcription: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.stt, { onDelete: 'CASCADE' })
    user: userEntity;

}