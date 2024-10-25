// src/products/dto/create-banner.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty({ example: 'Banner Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is a subtitle for the banner', required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ 
    type: 'Array', 
    format: 'binary', 
    required: false, 
    example: ['background1.jpg', 'background2.jpg']
  })
  @IsArray()
  background_images: string[]; // Array of image URLs

  @ApiProperty({ example: 'https://example.com/default-image.jpg' })
  @IsUrl()
  default_image: string;

  @ApiProperty({ example: 'Click Here' })
  @IsString()
  button_text: string;

  @ApiProperty({ example: 'https://example.com/button-url', uniqueItems: true })
  @IsUrl()
  button_url: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  Order_By: number;
}
