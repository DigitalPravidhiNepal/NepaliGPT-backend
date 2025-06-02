import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { authEntity } from "./auth.entity";
import { imageEntity } from "./image.entity";
import { codeEntity } from "./code.entity";
import { chatEntity } from "./chat.entity";
import { sttEntity } from "./stt.entity";
import { ttsEntity } from "./tts.entity";
import { contentEntity } from "./content.entity";
import { userTokenEntity } from "./userToken.entity";
import { paymentEntity } from "./payment.entity";
import { sessionEntity } from "./session.entity";
import { savedTempleteContentEntity } from "./savedTempleteContent.entity";

@Entity('user')
export class userEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    photo: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    country: string;

    @Column({ default: false })
    isActive: boolean;

    @OneToOne(() => authEntity, (auth) => auth.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'authId' })
    auth: authEntity;

    @OneToMany(() => imageEntity, (image) => image.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    image: imageEntity[];

    @OneToMany(() => codeEntity, (code) => code.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    code: codeEntity[];

    @OneToMany(() => chatEntity, (chat) => chat.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    chats: chatEntity[];

    @OneToMany(() => sttEntity, (stt) => stt.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    stt: sttEntity[];

    @OneToMany(() => ttsEntity, (tts) => tts.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    tts: ttsEntity[];

    @OneToMany(() => contentEntity, (content) => content.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    contents: contentEntity[];

    @OneToMany(() => savedTempleteContentEntity, (content) => content.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    savedTemplateContents: savedTempleteContentEntity[];

    @OneToMany(() => paymentEntity, (payment) => payment.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    payments: paymentEntity[];

    @OneToMany(() => sessionEntity, (session) => session.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    sessions: sessionEntity[];

    @OneToOne(() => userTokenEntity, (userTokens) => userTokens.user, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    tokens: userTokenEntity;
}
