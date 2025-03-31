import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admins {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo: string;

    @Column()
    name: string;

    @Column()
    telegram: string;

    @Column()
    element: string;

    @Column()
    Branch: string;
}