import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BoissonService } from './boisson.service';
import { CreateBoissonDto, UpdateBoissonDto } from './dto/boisson.dto';

@Controller('boissons')
export class BoissonController {
  constructor(private readonly boissonService: BoissonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBoissonDto: CreateBoissonDto) {
    return this.boissonService.create(createBoissonDto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.boissonService.findByCategory(category);
    }
    return this.boissonService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.boissonService.findAvailable();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
    return this.boissonService.findByCategory(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boissonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoissonDto: UpdateBoissonDto) {
    return this.boissonService.update(+id, updateBoissonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.boissonService.remove(+id);
  }
}
