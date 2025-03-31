import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Forms {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    photo: string;

    @Column({nullable: true})
    rating: string;

    @Column()
    city: string;

    @Column()
    recommended: boolean;

    @Column({nullable: true})
    date: string;

    @Column({nullable: true})
    info: string;

    @Column()
    buttons: string;

    @Column({nullable: true})
    text: string;


    @Column({nullable: true})
    next_to_button: string;

    @Column()
    position: number;
}