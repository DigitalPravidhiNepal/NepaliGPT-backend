import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity('TextToSpeech')
export class ttsEntity extends parentEntity {
    @Column()
    text: string;

    @Column()
    audio: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.tts, { onDelete: 'CASCADE' })
    user: userEntity;

}