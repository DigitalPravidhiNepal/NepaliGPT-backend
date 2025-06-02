import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { templateEntity } from "./templates.entity";
import { userEntity } from "./user.entity";

@Entity('savedTempleteContent')
export class savedTempleteContentEntity extends parentEntity {
    @Column()
    content: string;

    @ManyToOne(() => templateEntity, (template) => template.savedContents, { onDelete: 'CASCADE' })
    template: templateEntity;

    @Column('jsonb', { nullable: true })
    inputData: Record<string, any>;

    @ManyToOne(() => userEntity, (user) => user.savedTemplateContents, { onDelete: 'CASCADE' })
    user: userEntity;
}