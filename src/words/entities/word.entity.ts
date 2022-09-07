import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ExampleEntity } from './expamle.entity';

@Entity()
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  word: string;

  @ManyToOne(() => ExampleEntity, (expamle) => expamle.words, {
    nullable: true,
  })
  @JoinColumn({ name: 'exampleId' })
  example: ExampleEntity;

  @Column({ nullable: true })
  exampleId: string;
}
