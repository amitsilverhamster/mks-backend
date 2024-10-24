// src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateProductDto {
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
