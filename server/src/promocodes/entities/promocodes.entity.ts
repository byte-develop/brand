import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Promocode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    promocode: string;

    @Column()
    userid: number;

    @Column()
    bonus: string;

    @Column()
    status: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    datetime: Date; 
}