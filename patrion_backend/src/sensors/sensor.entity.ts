import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sensorId: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.sensors)
  @JoinTable()
  allowedUsers: User[];
}
