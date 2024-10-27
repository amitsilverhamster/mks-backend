import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer.config';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new project' })
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
        slug: { type: 'string' },
      },
    },
  })
  async create(@Body() createProjectDto: CreateProjectDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received:', files); // Log the received files to check if they exist
    if (!files || !files.images) {
      throw new Error('No images uploaded');
    }

    return this.projectsService.create(createProjectDto, files.images);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all projects.' })
  findAll() {
    return this.projectsService.findAll();
  }
  @Get('/get-projects')
  @ApiResponse({ status: 200, description: 'Returns some products.' })
  findSome() {
    return this.projectsService.findSome();
  }
  @Get('edit/:id')
  @ApiResponse({ status: 200, description: 'Returns the project with the given id.' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'update a new project' })
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
        slug: { type: 'string' },
      },
    },
  })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    console.log('Files received for update:', files); // Log for update as well
    return this.projectsService.update(id, updateProjectDto, files?.images);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Removes the project with the given id.' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
