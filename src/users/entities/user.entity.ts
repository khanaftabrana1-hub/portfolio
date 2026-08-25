import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    userId!: number;

    @Column({ name: 'first_name', nullable: true })
    firstName!: string;

    @Column({ name: 'last_name', nullable: true })
    lastName!: string;

    @Column({ name: 'user_email', nullable: true })
    userEmail!: string;

    @Column({ name: 'password_hash', nullable: true })
    passwordHash!: string;

    @Column({ name: 'varify_email', nullable: true })
    varifyEmail!: string;

   
    @Column({ type: 'varchar', nullable: true })
    otp!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    otpExpiresAt!: Date | null;
}