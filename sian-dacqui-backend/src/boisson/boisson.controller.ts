import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { BoissonService } from './boisson.service';

@Controller('boissons')
export class BoissonController {
  constructor(private readonly boissonService: BoissonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() boisson: any) {
    return this.boissonService.create(boisson);
  }

  @Get()
  findAll() {
    return this.boissonService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.boissonService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boissonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() boisson: any) {
    return this.boissonService.update(+id, boisson);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.boissonService.remove(+id);
  }
}
