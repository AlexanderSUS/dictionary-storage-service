import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WordEntity } from './word.entity';

@Entity()
export class ExampleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sentence: string;

  @OneToMany(() => WordEntity, (word) => word.example, {
    nullable: false,
  })
  words: WordEntity[];
}
