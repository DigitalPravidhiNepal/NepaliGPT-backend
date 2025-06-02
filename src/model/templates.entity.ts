import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { AccessType } from "src/helper/types/index.type";
import { userEntity } from "./user.entity";
import { FieldDto } from "src/modules/templates/dto/create-template.dto";
import { contentEntity } from "./content.entity";
import { templateCategoryEntity } from "./templateCategory.entity";
@Entity('Template')
export class templateEntity extends parentEntity {
    @Column()
    title: string;

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

    @OneToMany(() => contentEntity, (content) => content.template)
    savedContents: contentEntity[];

    @ManyToMany(() => templateCategoryEntity, (category) => category.templates)
    categories: templateCategoryEntity[];
}
