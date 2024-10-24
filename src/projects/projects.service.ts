import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { readdir, rmdir, unlink } from 'fs';
import { join } from 'path';


@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateProjectDto, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      console.error('No files uploaded or files array is empty');
      throw new Error('No files uploaded');
    }

    const images = files.map((file) => {
      if (!file.path) {
        console.error('File path is undefined for file:', file);
        throw new Error('File path is undefined');
      }
      return {
        path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
      };
    });

    // Extract paths based on the year/month/day structure
    const imagePaths = images.map((image) => {
      // Get year/month/day/filename from the image path
      const parts = image.path.split('/');
      const year = parts[parts.length - 4]; // Year
      const month = parts[parts.length - 3]; // Month
      const day = parts[parts.length - 2]; // Day
      const filename = parts[parts.length - 1]; // Get the filename
      return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
    });

    console.log('Image paths:', imagePaths);

    // Convert the project name into a slug
    const slug = data.name.toLowerCase().replace(/ /g, '-');
    const projectData = {
      ...data,
      images: imagePaths,
      default_image: imagePaths[0] || '', // Set the first image as the default
      slug, // Set the project slug
    };

    return this.prisma.projects.create({
      data: projectData,
    });
  }

  async findAll() {
    const projects = await this.prisma.projects.findMany({           
      orderBy: {
        created_at: 'desc', // Change 'createdAt' to the field you want to sort by (e.g., 'price', 'id')
      },
    });

    return {
      status: 'success',
      data: projects,
    };
  }

  async findOne(id: string) {
    const projectById = await this.prisma.projects.findUnique({
      where: { id },
    });
    if (!projectById) {
      throw new NotFoundException('projectById not found');
    }

    return {
      status: 'success',
      data: projectById,
    };
  }

  async update(id: string, data: UpdateProjectDto, files?: Express.Multer.File[]) {
    const existingProject = await this.prisma.projects.findUnique({ where: { id } });

    if (files && files.length > 0) {
      const images = files.map((file) => {
        if (!file.path) {
          console.error('File path is undefined for file:', file);
          throw new Error('File path is undefined');
        }
        return {
          path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
        };
      });

      const imagePaths = images.map((image) => {
        const parts = image.path.split('/');
        const year = parts[parts.length - 4];
        const month = parts[parts.length - 3];
        const day = parts[parts.length - 2];
        const filename = parts[parts.length - 1];
        return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
      });

      console.log('Updated Image paths:', imagePaths);

      // Optional: Remove old images if necessary
      existingProject.images.forEach((image) => {
        unlink(join(__dirname, '..', '..', 'public', image), (err) => {
          if (err) {
            console.error(`Error deleting image: ${image}`, err);
          }
        });
      });
      const slug = data.name.toLowerCase().replace(/ /g, '-');

      data = {
        ...data,
        images: imagePaths,
        default_image: imagePaths[0] || '', // Optionally update the default image
        slug, // Set the project slug
      };
    }

    return this.prisma.projects.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existingProject = await this.prisma.projects.findUnique({ where: { id } });

    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    // Remove associated images
    const imageFolderPath = join(__dirname, '..', '..', 'public', 'uploads');
    const imagePaths = existingProject.images.map(image => join(imageFolderPath, image));

    for (const imagePath of imagePaths) {
      await this.deleteFile(imagePath);
    }

    // Check if the folder is empty and delete it if it is
    await this.deleteFolderIfEmpty(imageFolderPath);

    // Delete the project from the database
    await this.prisma.projects.delete({ where: { id } });

    return { message: 'Project and associated images deleted successfully' };
  }

  private deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${filePath}`, err);
          return reject(err);
        }
        resolve();
      });
    });
  }

  private deleteFolderIfEmpty(folderPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      readdir(folderPath, (err, files) => {
        if (err) {
          console.error(`Error reading folder: ${folderPath}`, err);
          return reject(err);
        }

        if (files.length === 0) {
          rmdir(folderPath, (err) => {
            if (err) {
              console.error(`Error deleting folder: ${folderPath}`, err);
              return reject(err);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }
}
