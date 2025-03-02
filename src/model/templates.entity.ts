import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { AccessType } from "src/helper/types/index.type";
import { userEntity } from "./user.entity";
import { FieldDto } from "src/modules/templates/dto/create-template.dto";
@Entity('Template')
export class templateEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    pricing: AccessType;

    @Column()
    category: string; // e.g., 'Blog', 'Text', 'Social'

    @Column('jsonb', { nullable: true }) // Store fields as JSON
    fields: FieldDto[];

    @Column()
    promptTemplate: string;

    @Column({ default: null })
    content: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.image)
    user: userEntity;


}
