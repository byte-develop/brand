import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Crash {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gamePhase: string;

    @Column()
    timeLeft: number;

    @Column()
    result: string;

    @Column()
    UID: string;
}