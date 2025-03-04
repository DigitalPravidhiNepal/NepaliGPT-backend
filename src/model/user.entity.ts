import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { authEntity } from "./auth.entity";
import { imageEntity } from "./image.entity";
import { codeEntity } from "./code.entity";
import { chatEntity } from "./chat.entity";
import { sttEntity } from "./stt.entity";
import { ttsEntity } from "./tts.entity";
import { subscriptionEntity } from "./subscription.entity";
import { templateEntity } from "./templates.entity";
import { contentEntity } from "./content.entity";
import { userTokenEntity } from "./userToken.entity";

@Entity('user')
export class userEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    photo: string;

    @Column()
    phone: string;

    @Column()
    country: string;

    @Column({ default: false })
    isActive: boolean;

    @OneToOne(() => authEntity, (auth) => auth.user, { cascade: true })
    @JoinColumn({ name: 'authId' })
    auth: authEntity;

    @OneToMany(() => imageEntity, (image) => image.user, { cascade: true })
    image: imageEntity[];

    @OneToMany(() => codeEntity, (code) => code.user, { cascade: true })
    code: codeEntity[];

    @OneToMany(() => chatEntity, (chat) => chat.user, { cascade: true })
    chat: chatEntity[];

    @OneToMany(() => sttEntity, (stt) => stt.user, { cascade: true })
    stt: sttEntity[];

    @OneToMany(() => ttsEntity, (tts) => tts.user, { cascade: true })
    tts: ttsEntity[];

    @OneToMany(() => subscriptionEntity, (subscription) => subscription.user, { cascade: true })
    subscription: subscriptionEntity[];

    @OneToMany(() => contentEntity, (content) => content.user, { cascade: true })
    contents: contentEntity[];

    @OneToOne(() => userTokenEntity, (userTokens) => userTokens.user, { cascade: true })
    @JoinColumn()
    tokens: userTokenEntity;
}