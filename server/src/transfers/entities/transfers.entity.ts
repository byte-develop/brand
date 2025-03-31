import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Transfers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_user: number;
    
    @Column()
    price: string;

    @Column()
    date: Date;

    @Column()
    key: string;
}