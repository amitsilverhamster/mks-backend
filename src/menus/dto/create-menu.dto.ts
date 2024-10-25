import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'menu name' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'menu slug' })
    slug: string;
}
