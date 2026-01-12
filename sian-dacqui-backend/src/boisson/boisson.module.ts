import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoissonController } from './boisson.controller';
import { BoissonService } from './boisson.service';
import { Boisson } from './boisson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Boisson])],
  controllers: [BoissonController],
  providers: [BoissonService],
  exports: [BoissonService],
})
export class BoissonModule {}
