import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('boissons')
export class Boisson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column({ length: 50, nullable: true })
  size: string; // ex: "33cl", "50cl", "1L"

  @Column({ length: 50, default: 'AUTRE' })
  category: string; // SODAS, BIERE, VINS, CAFE, AUTRE

  @Column({ length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number; // Pour contrôler l'ordre d'affichage

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
