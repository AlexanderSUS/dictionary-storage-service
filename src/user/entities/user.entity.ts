import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshTokenHash: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: number;
}
