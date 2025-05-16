import { Company } from 'src/company/company.entity';
import { Sensor } from 'src/sensors/sensor.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';

export enum Role {
  SYSTEM_ADMIN = 'system_admin',
  COMPANY_ADMIN = 'company_admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ManyToOne(() => Company, (company) => company.users, { eager: true, nullable: true })
  company: Company;

  @ManyToMany(() => Sensor, (sensor) => sensor.allowedUsers)
  sensors: Sensor[];
}
