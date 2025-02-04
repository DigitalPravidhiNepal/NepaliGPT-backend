import { Column, Entity } from "typeorm";
import { parentEntity } from ".";

@Entity('audio')
export class audioEntity extends parentEntity {
    @Column()
    prompt: string;
}