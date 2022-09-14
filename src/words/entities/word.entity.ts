import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WordEntityMeaning } from 'src/types/textProcessing';
import { UserWord } from './userWord.entity';

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
  meaning: WordEntityMeaning[];

  @Column({ default: 0 })
  occourrence: number;

  @OneToMany(() => UserWord, (userWord) => userWord.word)
  userWords: UserWord[];
}
