import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    photo: string | null;

    @Column()
    login: string;

    @Column({ nullable: true }) 
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    favourite: string | null;

    @Column({ default: 0 })
    balance: number;

    @Column({ nullable: true })
    bonus: Date | null;

    @Column({ default: 0 })
    bonus_count: number;

    @Column({ type: 'timestamp', nullable: true }) 
    last_bonus_claimed: Date | null;

    @Column({ default: true })
    is_bonus_active: boolean;

    @Column({ nullable: true })
    ref: string;
}

export interface BonusResponse {
    bonus_num: number;
    message: string;
    timeRemaining?: string;
}