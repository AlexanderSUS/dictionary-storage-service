import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WordStatus } from 'src/const/enum';
import { WordEntityMeaning } from 'src/types/textProcessing';

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

  @Column({
    type: 'enum',
    enum: WordStatus,
    default: WordStatus.NEW,
  })
  status: WordStatus;
}
