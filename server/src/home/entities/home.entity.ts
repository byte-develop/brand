import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Home {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    telegram: string;

    @Column()
    element: string;
}