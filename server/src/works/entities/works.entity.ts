import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Works {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    photo: string;

    @Column()
    category: string;

    @Column()
    position: string;

    @Column()
    city: string;

    @Column()
    text: string;

    @CreateDateColumn()
    date: Date;

    @Column({ default: 0 })
    position_numer: number;
    
    @Column()
    link: string;

    @Column()
    zalog: string;
}