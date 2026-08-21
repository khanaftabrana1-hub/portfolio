import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({nullable:true})
  senderEmail!: string;

  @Column({nullable:true})
  receiverEmail!: string;

  @Column('text')
  message!: string;

  @CreateDateColumn({nullable:true})
  createdAt!: Date&TimeRanges;
}