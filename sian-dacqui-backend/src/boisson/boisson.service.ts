import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boisson } from './boisson.entity';

@Injectable()
export class BoissonService {
  constructor(
    @InjectRepository(Boisson)
    private boissonRepository: Repository<Boisson>,
  ) {}

  findAll(): Promise<Boisson[]> {
    return this.boissonRepository.find({ order: { displayOrder: 'ASC', id: 'ASC' } });
  }

  findOne(id: number): Promise<Boisson> {
    return this.boissonRepository.findOne({ where: { id } });
  }

  findAvailable(): Promise<Boisson[]> {
    return this.boissonRepository.find({ 
      where: { available: true },
      order: { displayOrder: 'ASC', id: 'ASC' }
    });
  }

  findByCategory(category: string): Promise<Boisson[]> {
    return this.boissonRepository.find({ 
      where: { category: category.toUpperCase() },
      order: { displayOrder: 'ASC', id: 'ASC' }
    });
  }

  create(boisson: Partial<Boisson>): Promise<Boisson> {
    const newBoisson = this.boissonRepository.create(boisson);
    return this.boissonRepository.save(newBoisson);
  }

  async update(id: number, boisson: Partial<Boisson>): Promise<Boisson> {
    await this.boissonRepository.update(id, boisson);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.boissonRepository.delete(id);
  }
}
