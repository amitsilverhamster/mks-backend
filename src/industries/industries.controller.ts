// src/industries/industries.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer.config';

@ApiTags('Industries')
@Controller('industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new industry' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        slug: { type: 'string' },
      },
    },
  })
  async create(@Body() createIndustryDto: CreateIndustryDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received:', files);
    if (!files || !files.images) {
      throw new Error('No images uploaded');
    }

    return this.industriesService.create(createIndustryDto, files.images);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all industries.' })
  findAll() {
    return this.industriesService.findAll();
  }

  @Get('edit/:id')
  @ApiResponse({ status: 200, description: 'Returns the industry with the given id.' })
  findOne(@Param('id') id: string) {
    return this.industriesService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an industry' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        slug: { type: 'string' },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateIndustryDto: UpdateIndustryDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received for update:', files);
    return this.industriesService.update(id, updateIndustryDto, files?.images);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Removes the industry with the given id.' })
  remove(@Param('id') id: string) {
    return this.industriesService.remove(id);
  }
}
