import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WordStatus } from 'src/const/enum';
import { User } from 'src/user/entities/user.entity';
import { Word } from './word.entity';

@Entity()
export class UserWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: WordStatus,
    default: WordStatus.NEW,
  })
  status: WordStatus;

  @ManyToOne(() => User, (user) => user.words)
  user: User;

  @ManyToOne(() => Word, (word) => word.userWords)
  word: Word;
}
