import { Column, Entity, ManyToOne } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";
import { superAdminEntity } from "./superAdmin.entity";

@Entity('image')
export class imageEntity extends parentEntity {
    @Column()
    prompt: string;

    @Column()
    image: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => userEntity, (user) => user.image, { onDelete: 'CASCADE' })
    user: userEntity;

}