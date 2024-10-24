// src/products/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @ApiProperty({ example: 'Updated Product Name', required: false })
  name?: string;

  @ApiProperty({ example: 'Updated description of the product', required: false })
  description?: string;

  @ApiProperty({ example: 'Updated specifications of the product', required: false })
  specifications?: string;

  @ApiProperty({
    example: ['https://example.com/updated-image1.jpg', 'https://example.com/updated-image2.jpg'],
    required: false,
  })
  images?: string[];
  @ApiProperty({ example: 'Updated private_category of the product', required: false })
  primary_category_id: string;

  @ApiProperty({ type: 'Array', format: 'binary', required: false ,example: ['image1.jpg', 'image2.jpg']  })
  categpry_ids?: string[]; 

  @ApiProperty({ example: 'https://example.com/updated-default-image.jpg', required: false })
  default_image?: string;

  @ApiProperty({ example: 'Updated short description of the product', required: false })
  short_description?: string;

  @ApiProperty({ example: 'Updated Meta Title for SEO', required: false })
  meta_title?: string;

  @ApiProperty({ example: 'Updated Meta Description for SEO', required: false })
  meta_description?: string;

  @ApiProperty({ example: '54321', required: false })
  sku?: string;

  @ApiProperty({ example: 'updated-product-slug', required: false })
  slug?: string;

  @ApiProperty({ example: false, required: false })
  indexing?: boolean;
  category_ids: any;

}
