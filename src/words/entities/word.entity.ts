import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { WordStatus } from 'src/const/enum';

@Entity()
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @Column({
    type: 'enum',
    enum: WordStatus,
    default: WordStatus.NEW,
  })
  status: WordStatus;
}
