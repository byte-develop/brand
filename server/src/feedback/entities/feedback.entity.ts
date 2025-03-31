import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    login: string;

    @Column()
    UserId: number;

    @Column()
    id_shop: number;

    @Column()
    quantity: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date; 

    @Column()
    text: string;

    @Column({ default: true }) 
    hide: boolean;
}