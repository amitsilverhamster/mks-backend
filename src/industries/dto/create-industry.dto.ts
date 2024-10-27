// src/products/dto/create-industry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateIndustryDto {
  @ApiProperty({ type: [String], example: ['image1.jpg', 'image2.jpg'], description: 'Array of image URLs' })
  @IsArray()
  @IsOptional()
  images?: string[]; // Matches the images field in the schema

  @ApiProperty({ example: 'https://example.com/default-image.jpg', description: 'URL of the default image' })
  @IsString()
  default_image: string;

  @ApiProperty({ example: 'product-slug', uniqueItems: true, description: 'Unique industry slug' })
  @IsString()
  slug: string;
}
