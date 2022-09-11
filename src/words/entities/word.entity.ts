import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WordStatus } from 'src/const/enum';
import { Meaning } from 'src/types/dictionaryApiResponce';

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
  meaning: Meaning[];

  @Column({
    type: 'enum',
    enum: WordStatus,
    default: WordStatus.NEW,
  })
  status: WordStatus;
}
