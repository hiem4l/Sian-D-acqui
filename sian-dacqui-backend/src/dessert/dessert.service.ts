import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dessert } from './dessert.entity';

@Injectable()
export class DessertService {
  constructor(
    @InjectRepository(Dessert)
    private dessertRepository: Repository<Dessert>,
  ) {}

  findAll(): Promise<Dessert[]> {
    return this.dessertRepository.find();
  }

  findOne(id: number): Promise<Dessert> {
    return this.dessertRepository.findOne({ where: { id } });
  }

  findAvailable(): Promise<Dessert[]> {
    return this.dessertRepository.find({ where: { available: true } });
  }

  create(dessert: Partial<Dessert>): Promise<Dessert> {
    const newDessert = this.dessertRepository.create(dessert);
    return this.dessertRepository.save(newDessert);
  }

  async update(id: number, dessert: Partial<Dessert>): Promise<Dessert> {
    await this.dessertRepository.update(id, dessert);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.dessertRepository.delete(id);
  }
}
