import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Bets {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    betAmount: number;

    @Column()
    betColor: string;

    @Column()
    betTime: Date;

    @Column()
    UID: string;
}