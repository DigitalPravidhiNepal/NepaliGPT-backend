import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { templateEntity } from "./templates.entity";

@Entity('TemplateCategory')
export class templateCategoryEntity extends parentEntity {
    @Column()
    name: string;

    @ManyToMany(() => templateEntity, (template) => template.categories,{ nullable: true })
    @JoinTable({ name: 'template_category' })
    templates: templateEntity[];
}