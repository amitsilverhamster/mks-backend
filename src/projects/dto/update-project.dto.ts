// src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {

  @ApiProperty({ example: 'Product Name' })
  name: string;
  @ApiProperty({ example: 'This is a product description', required: false })
  description?: string;
  @ApiProperty({ type: 'Array', format: 'binary', required: false, example: ['image1.jpg', 'image2.jpg'] })
  images?: any[]; // Handle image file uploads

  @ApiProperty({ example: 'https://example.com/default-image.jpg' })
  default_image: string;

  @ApiProperty({ example: 'Short description of the product' })
  short_description: string;

  @ApiProperty({ example: 'product-slug', uniqueItems: true })
  slug: string;

}
