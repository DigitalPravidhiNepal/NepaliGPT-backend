import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { AccessType } from "src/helper/types/index.type";
import { FieldDto } from "src/modules/templates/dto/create-template.dto";
import { contentEntity } from "./content.entity";
import { templateCategoryEntity } from "./templateCategory.entity";
import { userEntity } from "./user.entity";

@Entity('Template')
export class templateEntity extends parentEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    pricing: AccessType;

    @Column('jsonb', { nullable: true }) // Store fields as JSON
    fields: FieldDto[];

    @Column()
    promptTemplate: string;

    @Column({ default: false })
    isFeatured: boolean;

    @OneToMany(() => contentEntity, (content) => content.template)
    contents: contentEntity[];

    @OneToMany(() => contentEntity, (content) => content.template)
    savedContents: contentEntity[];

    @ManyToMany(() => templateCategoryEntity, (category) => category.templates, { nullable: true })
    categories: templateCategoryEntity[];

    @ManyToMany(() => userEntity, (user) => user.favorites)
    favoritedBy: userEntity[];
}
