import { Column } from "typeorm";
import { parentEntity } from ".";

export class templateEntity extends parentEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    isPremium: boolean;

    @Column()
    category: string;

    @Column('text')
    content: string;
}
