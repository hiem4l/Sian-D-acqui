import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, Min } from 'class-validator';

export enum BoissonCategory {
  SODAS = 'SODAS',
  BIERE = 'BIERE',
  VINS = 'VINS',
  CAFE = 'CAFE',
  AUTRE = 'AUTRE'
}

export class CreateBoissonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsString()
  size?: string;

  @IsEnum(BoissonCategory)
  category: BoissonCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdateBoissonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsEnum(BoissonCategory)
  category?: BoissonCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
