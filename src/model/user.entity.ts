import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { authEntity } from "./auth.entity";
import { imageEntity } from "./image.entity";
import { codeEntity } from "./code.entity";
import { chatEntity } from "./chat.entity";
import { sttEntity } from "./stt.entity";
import { ttsEntity } from "./tts.entity";
import { subscriptionEntity } from "./subscription.entity";

@Entity('user')
export class userEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    photo: string;

    @Column()
    phone: string;

    @Column()
    country: string;

    @Column()
    isActive: boolean;

    @OneToOne(() => authEntity, (auth) => auth.user)
    @JoinColumn({ name: 'authId' })
    auth: authEntity;

    @OneToMany(() => imageEntity, (image) => image.user)
    image: imageEntity[];

    @OneToMany(() => codeEntity, (code) => code.user)
    code: codeEntity[];

    @OneToMany(() => chatEntity, (chat) => chat.user)
    chat: chatEntity[];

    @OneToMany(() => sttEntity, (stt) => stt.user)
    stt: sttEntity[];

    @OneToMany(() => ttsEntity, (tts) => tts.user)
    tts: ttsEntity[];

    @OneToMany(() => subscriptionEntity, (subscription) => subscription.user)
    subscription: subscriptionEntity[]
}