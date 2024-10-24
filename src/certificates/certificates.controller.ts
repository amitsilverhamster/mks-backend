import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { CreateCerificateDto } from './dto/create-certificate.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { multerOptions } from 'src/multer.config';
import { CerificateService } from './certificates.service';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Controller('cerificate')
export class CerificateController {
  constructor(private readonly cerificateService: CerificateService) {}

@Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new product' })
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
        name: { type: 'string' },
        meta_description: { type: 'string' },
      },
    },
  })
  async create(@Body() createCerificateDto: CreateCerificateDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received:', files); // Log the received files to check if they exist
    if (!files || !files.images) {
      throw new Error('No images uploaded');
    }

    return this.cerificateService.create(createCerificateDto, files.images);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Cerificates' })
  @ApiResponse({ status: 200, description: 'Return all Cerificates.' })
  async findAll(@Query() query: any) {  
    return await this.cerificateService.findCertificate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cerificateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCerificateDto: UpdateCertificateDto) {
    return this.cerificateService.update(+id, updateCerificateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cerificateService.remove(+id);
  }
}
