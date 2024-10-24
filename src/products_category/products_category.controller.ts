import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsCategoryService } from './products_category.service';
import { CreateProductsCategoryDto } from './dto/create-products_category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products_category.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth()
@ApiTags('products-category')
@Controller('products-category')
export class ProductsCategoryController {
  constructor(private readonly productsCategoryService: ProductsCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({ status: 201, description: 'The product category has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProductsCategoryDto: CreateProductsCategoryDto) {
    return this.productsCategoryService.create(createProductsCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: 200, description: 'Return all product categories.' })
  findAll(@Query() query: any) {
    return this.productsCategoryService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by ID' })
  @ApiResponse({ status: 200, description: 'Return the product category.' })
  @ApiResponse({ status: 404, description: 'Product category not found.' })
  findOne(@Param('id') id: string) {
    return this.productsCategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product category by ID' })
  @ApiResponse({ status: 200, description: 'The product category has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Product category not found.' })
  update(@Param('id') id: string, @Body() updateProductsCategoryDto: UpdateProductsCategoryDto) {
    return this.productsCategoryService.update(id, updateProductsCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product category by ID' })
  @ApiResponse({ status: 200, description: 'The product category has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Product category not found.' })
  remove(@Param('id') id: string) {
    return this.productsCategoryService.remove(id);
  }
}