import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('attribute')
@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Attribute' })
  @ApiResponse({ status: 201, description: 'Attribute successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProductsCategoryDto: CreateAttributeDto) {
    return this.attributeService.create(createProductsCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Attributes' })
  @ApiResponse({ status: 200, description: 'Return all Attributes.' })
  findAll(@Query() query: any) {  
    return this.attributeService.findAll(query);
  }

  @Get('edit-attribute/:id')
  @ApiOperation({ summary: 'Get a specific Attribute' })
  @ApiResponse({ status: 200, description: 'Return a specific Attribute.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.attributeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific Attribute' })
  @ApiResponse({ status: 200, description: 'Attribute successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
    return this.attributeService.update(id, updateAttributeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific Attribute' })
  @ApiResponse({ status: 200, description: 'Attribute successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  remove(@Param('id') id: string) {
    return this.attributeService.remove(id);
  }
}
