import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExampleEntity } from './expamle.entity';
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

  @ManyToOne(() => ExampleEntity, (expamle) => expamle.words, {
    nullable: true,
  })
  @JoinColumn({ name: 'exampleId' })
  example: ExampleEntity;

  @Column({ nullable: true })
  exampleId: string;
}
