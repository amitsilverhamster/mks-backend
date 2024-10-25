// src/products/dto/update-banner.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBannerDto } from './create-banner.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  Order_By?: number;
}
