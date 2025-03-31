import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Sales {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    photo: string;

    @Column()
    photo_mobile: string;

    @Column()
    links: string

    @Column({nullable: true})
    color: string | null

    @Column()
    city: string
}