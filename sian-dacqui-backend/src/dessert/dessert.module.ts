import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DessertController } from './dessert.controller';
import { DessertService } from './dessert.service';
import { Dessert } from './dessert.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dessert])],
  controllers: [DessertController],
  providers: [DessertService],
  exports: [DessertService],
})
export class DessertModule {}
