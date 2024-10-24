// src/products/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name' })
  name: string;

  @ApiProperty({ example: 'This is a product description', required: false })
  description?: string;

  @ApiProperty({ example: 'Product specifications', required: false })
  specifications?: string;
  @ApiProperty({ type: 'Array', format: 'binary', required: false ,example: ['image1.jpg', 'image2.jpg']  })
  images?: any[]; // Handle image file uploads
  @ApiProperty({ example: ' private_category', required: false })
  primary_category_id: string;

  @ApiProperty({ type: 'Array', format: 'binary', required: false ,example: ['image1.jpg', 'image2.jpg']  })
  categpry_ids?: string[]; 

  @ApiProperty({ example: 'https://example.com/default-image.jpg' })
  default_image: string;

  @ApiProperty({ example: 'Short description of the product' })
  short_description: string;

  @ApiProperty({ example: 'Meta Title for SEO' })
  meta_title: string;

  @ApiProperty({ example: 'Meta Description for SEO' })
  meta_description: string;

  @ApiProperty({ example: '12345' })
  sku: string;

  @ApiProperty({ example: 'product-slug' ,uniqueItems: true})
  slug: string;

  @ApiProperty({ type: 'boolean' ,example: true })
  @IsBoolean()  
  indexing: boolean;
  category_ids: any;
}
