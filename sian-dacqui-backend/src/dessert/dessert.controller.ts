import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { DessertService } from './dessert.service';

@Controller('desserts')
export class DessertController {
  constructor(private readonly dessertService: DessertService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dessert: any) {
    return this.dessertService.create(dessert);
  }

  @Get()
  findAll() {
    return this.dessertService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.dessertService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dessertService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dessert: any) {
    return this.dessertService.update(+id, dessert);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.dessertService.remove(+id);
  }
}
