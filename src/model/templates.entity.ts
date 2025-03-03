import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { AccessType } from "src/helper/types/index.type";
import { userEntity } from "./user.entity";
import { FieldDto } from "src/modules/templates/dto/create-template.dto";
import { contentEntity } from "./content.entity";
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

    @OneToMany(() => contentEntity, (content) => content.template)
    contents: contentEntity[];


}
