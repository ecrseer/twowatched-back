import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('publicacao')
export class Publicacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idAutor: string;

  @Column()
  content: string;

  @Column('text', { array: true, nullable: true })
  imageUrls?: string[];

  @Column({ default: 0, nullable: true })
  likesCount?: number;

  @Column({ default: 0, nullable: true })
  commentsCount?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
