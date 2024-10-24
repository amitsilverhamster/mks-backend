import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'Blog title' })
  title: string;

  @ApiProperty({ example: 'This is a Blog short_description', required: false })
  short_description: string;

  @ApiProperty({ example: 'Blog meta title', required: false })
  meta_title: string;

  @ApiProperty({ example: 'Blog meta description', required: false })
  meta_description: string;

  @ApiProperty({ example: 'Blog slug', required: false })
  slug: string;

  @ApiProperty({ type: 'Array', format: 'binary', required: false ,example: ['image1.jpg', 'image2.jpg']  })
  featured_img?: any[]; // Handle image file uploads

  @ApiProperty({ example: ' content', required: false })
  content: string;

  @ApiProperty({ example: 'https://example.com/default-image.jpg', required: false })
  default_image: string;
}
