import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer.config';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
        description: { type: 'string' },
        short_description: { type: 'string' },
        meta_title: { type: 'string' },
        meta_description: { type: 'string' },
        sku: { type: 'string' },
        primary_category_id: { type: 'string' },
        category_ids: { type: 'array', items: { type: 'string' } },
        slug: { type: 'string' },
        indexing: {
          type: 'boolean',
          description: 'Use this toggle switch to set indexing to true or false.',
        },
      },
    },
  })
  async create(@Body() createProductDto: CreateProductDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received:', files); // Log the received files to check if they exist
    if (!files || !files.images) {
      throw new Error('No images uploaded');
    }

    return this.productsService.create(createProductDto, files.images);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all products.' })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('edit/:id')
  @ApiResponse({ status: 200, description: 'Returns the product with the given id.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'update a new product' })
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
        description: { type: 'string' },
        short_description: { type: 'string' },
        meta_title: { type: 'string' },
        meta_description: { type: 'string' },
        sku: { type: 'string' },
        primary_category_id: { type: 'string' },
        category_ids: { type: 'array', items: { type: 'string' } },
        slug: { type: 'string' },
        indexing: {
          type: 'boolean',
          description: 'Use this toggle switch to set indexing to true or false.',
        },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received for update:', files); // Log for update as well
    return this.productsService.update(id, updateProductDto, files?.images);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Removes the product with the given id.' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
