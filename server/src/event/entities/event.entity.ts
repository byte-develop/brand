import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Column()
  user_id: number;  

  @Column({nullable: true})
  telegram: string | null;

  @Column({nullable: true})
  element: string | null;

  @IsNotEmpty()
  @Column()
  ip: string;

  @Column({nullable: true})
  cookie: string | null;

  @IsNotEmpty()
  @Column()
  my_ref: string;

  @Column({nullable: true})
  join_ref: string | null;

  @IsNotEmpty()
  @Column({default: false})
  succes: boolean;

  @IsNotEmpty()
  @Column({default: false})
  moderation: boolean;

  @IsNotEmpty()
  @Column({default: false})
  ban: boolean;

  @Column({nullable: true})
  prize: string | null;

  @Column({default: 0})
  referrals: number;

  @IsNotEmpty()
  @Column({default: false})
  task_1: boolean;

  @IsNotEmpty()
  @Column({default: false})
  task_2: boolean;

  @IsNotEmpty()
  @Column({default: false})
  task_3: boolean;

  @IsNotEmpty()
  @Column({default: false})
  task_4: boolean; 
}