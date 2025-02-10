import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('bot')
export class botEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    role: string;

    @Column()
    instructions: string;

    @Column({ nullable: true })
    photo: string;
}