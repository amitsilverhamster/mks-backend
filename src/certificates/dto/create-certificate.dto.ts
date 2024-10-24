import { ApiProperty } from '@nestjs/swagger';
export class CreateCerificateDto {
    @ApiProperty({ example: 'Certificate Name' })
    name: string;

    @ApiProperty({ example: 'This is a Certificate description', required: false })
    meta_description?: string;

    @ApiProperty({ type: 'Array', format: 'binary', required: false ,example: ['image1.jpg', 'image2.jpg']  })
    image?: any[];

    @ApiProperty({ example: 'https://example.com/default-image.jpg' })
    default_image: string;

}
