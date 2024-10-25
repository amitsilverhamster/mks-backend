import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer.config';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'background_images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new banner' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        background_images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        button_text: { type: 'string' },
        button_url: { type: 'string' },
        Order_By: { type: 'integer' },
      },
    },
  })
  async create(@Body() createBannerDto: CreateBannerDto, @UploadedFiles() files: { background_images?: Express.Multer.File[] }) {
    console.log('Files received:', files); // Log to verify files received
    if (!files || !files.background_images) {
      throw new Error('No background images uploaded');
    }

    return this.bannersService.create(createBannerDto, files.background_images);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all banners.' })
  findAll() {
    return this.bannersService.findAll();
  }

  @Get('edit/:id')
  @ApiResponse({ status: 200, description: 'Returns the banner with the given id.' })
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'background_images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a banner' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        background_images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        button_text: { type: 'string' },
        button_url: { type: 'string' },
        Order_By: { type: 'integer' },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto, @UploadedFiles() files: { background_images?: Express.Multer.File[] }) {
    console.log('Files received for update:', files); // Log to verify files for update
    return this.bannersService.update(id, updateBannerDto, files?.background_images);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Removes the banner with the given id.' })
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}
