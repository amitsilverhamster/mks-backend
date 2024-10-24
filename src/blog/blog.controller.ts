import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.config';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'featured_img', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        featured_img: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        title: { type: 'string' },
        short_description: { type: 'string' },
        meta_title: { type: 'string' },
        meta_description: { type: 'string' },
        content : { type: 'string' },
        slug: { type: 'string' },
      },
    },
  })
  async create(@Body() createBlogDto: CreateBlogDto, @UploadedFiles() files: { featured_img?: Express.Multer.File[] }) {
    console.log('Files received:', files); // Log the received files to check if they exist
    if (!files || !files.featured_img) {
      throw new Error('No featured_img uploaded');
    }

    return this.blogService.create(createBlogDto, files.featured_img);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Attributes' })
  @ApiResponse({ status: 200, description: 'Return all Attributes.' })
  findAll(@Query() query: any) {  
    return this.blogService.findAll(query);
  }

  @Get('edit/:id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiResponse({ status: 200, description: 'Return the blog post.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'featured_img', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'update a new product' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        featured_img: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        title: { type: 'string' },
        short_description: { type: 'string' },
        meta_title: { type: 'string' },
        meta_description: { type: 'string' },
        slug: { type: 'string' },
        content : { type: 'string'},
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto, @UploadedFiles() files: { featured_img?: Express.Multer.File[] }) {
    console.log('Files received for update:', files); // Log for update as well
    return this.blogService.update(id, updateBlogDto, files?.featured_img);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post by ID' })
  @ApiResponse({ status: 200, description: 'The blog post has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
