import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Roulette {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gamePhase: string;

    @Column()
    timeLeft: number;

    @Column()
    result: string;

    @Column()
    rotate: number;

    @Column()
    UID: string;
}