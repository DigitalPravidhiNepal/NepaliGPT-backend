import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { subscriptionEntity } from "./subscription.entity";
import { AccessType } from "src/helper/types/index.type";

@Entity('package')
export class packageEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ type: 'int', nullable: true })
    codeGenerationLimit: number | null;

    @Column({ type: 'int', nullable: true })
    imageGenerationLimit: number | null;

    @Column({ type: 'int', nullable: true })
    speechToTextLimit: number | null;

    @Column({ type: 'int' })
    speechDurationLimit: number;

    @Column({ type: 'int', nullable: true })
    textToSpeechLimit: number | null;

    @Column({ type: 'int', nullable: true })
    textCharacterLimit: number | null;

    @Column({ type: 'int', nullable: true })
    templatePromptLimit: number | null;

    @Column({ type: 'int', nullable: true })
    supportRequestLimit: number | null;

    @Column({ type: 'int', nullable: true })
    maxTokenLimit: number | null;

    @Column()
    chatBotAccess: AccessType;

    @Column()
    templateAccess: AccessType;

    @Column({ type: 'decimal' })
    monthly_price: number;

    @Column({ type: 'decimal' })
    yearly_price: number;

    @OneToMany(() => subscriptionEntity, (subscription) => subscription.package)
    subscription: subscriptionEntity[];
}