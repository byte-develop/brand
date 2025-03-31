import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Crash {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: null, nullable: true })
    UID: string;

    @Column({ default: 'betting' })
    gamePhase: string;

    @Column({ default: 20 })
    timeLeft: number;

    @Column({ default: 0})
    result: number;
}
