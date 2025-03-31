import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, Index } from "typeorm";
import { validate, IsIn } from 'class-validator';

@Entity()
export class Ads {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    place: string;

    @Column({nullable: true})
    name: string;

    @Column()
    background: string;

    @Column()
    background_mobile: string;

    @Column()
    link: string

    @Column({nullable: true})
    color: string
}
