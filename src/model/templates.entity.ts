import { Column, Entity } from "typeorm";
import { parentEntity } from ".";
import { AccessType } from "src/helper/types/index.type";
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

    @Column({ nullable: true })
    content: string;

    @Column()
    promptTemplate: string;
}
