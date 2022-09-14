import { UserWord } from 'src/words/entities/userWord.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => UserWord, (word) => word.user)
  words: UserWord[];
}
