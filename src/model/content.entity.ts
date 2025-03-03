import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";
import { templateEntity } from "./templates.entity";

@Entity('content')
export class contentEntity extends parentEntity {
    @Column()
    content: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.contents, { onDelete: 'CASCADE' })
    user: userEntity;

    @ManyToOne(() => templateEntity, (template) => template.contents, { onDelete: 'CASCADE' })
    template: templateEntity;
}