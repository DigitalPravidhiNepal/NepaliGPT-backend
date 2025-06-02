import { Column, Entity, JoinColumn, ManyToMany } from "typeorm";
import { parentEntity } from ".";
import { templateEntity } from "./templates.entity";

@Entity('TemplateCategory')
export class templateCategoryEntity extends parentEntity {
    @Column()
    name: string;

    @ManyToMany(() => templateEntity, (template) => template.categories)
    @JoinColumn({ name: 'templateId' })
    templates: templateEntity[];
}