import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserWord } from './userWord.entity';
import { MeaningDto } from '../dto/meaning.dto';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @Column({ nullable: true })
  phonetic: string;

  @Column({ nullable: true })
  audio: string;

  @Column('text', { array: true })
  partOfSpeech: string[];

  @Column({ type: 'json' })
  meaning: MeaningDto[];

  @Column({ default: 0 })
  occurrence: number;

  @OneToMany(() => UserWord, (userWord) => userWord.word)
  userWords: UserWord[];
}
