import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { roleType } from "src/helper/types/index.type";
import { superAdminEntity } from "./superAdmin.entity";
import { userEntity } from "./user.entity";
@Entity('Auth')
export class authEntity extends parentEntity {
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: roleType;

    @Column({ default: null })
    rToken: string;

    @OneToOne(() => superAdminEntity, (sAdmin) => sAdmin.auth)
    superAdmin: superAdminEntity

    @OneToOne(() => userEntity, (user) => user.auth)
    user: userEntity
}