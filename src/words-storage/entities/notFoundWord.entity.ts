import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class NotFoundWord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  word: string;

  @Column({ default: 0 })
  occurrence: number;
}
