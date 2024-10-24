import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBlogDto, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      console.error('No files uploaded or files array is empty');
      throw new Error('No files uploaded');
    }

    const featured_img = files.map((file) => {
      if (!file.path) {
        console.error('File path is undefined for file:', file);
        throw new Error('File path is undefined');
      }
      return {
        path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
      };
    });

    // Extract paths based on the year/month/day structure
    const imagePaths = featured_img.map((image) => {
      // Get year/month/day/filename from the image path
      const parts = image.path.split('/');
      const year = parts[parts.length - 4]; // Year
      const month = parts[parts.length - 3]; // Month
      const day = parts[parts.length - 2]; // Day
      const filename = parts[parts.length - 1]; // Get the filename
      return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
    });

    console.log('Image paths:', imagePaths);

    // Convert the product name into a slug
    // const slug = data.name.toLowerCase().replace(/ /g, '-');
    const blogData = {
      ...data,
      featured_img: imagePaths, // Set the array of image paths as the featured images
      default_image: imagePaths[0] || '', // Set the first image as the default
    };

    return this.prisma.blog.create({
      data: blogData,
    });
  }


  async findAll(query: any) {
    // Parse pagination parameters using the helper
    const { page, itemsPerPage } = PaginationHelper.parsePaginationParams(query);
  
    // Fetch total count of attributes
    const totalItems = await this.prisma.blog.count();
  
    // Fetch paginated attributes from the database
    const blog = await this.prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        short_description: true,
        meta_title: true,
        meta_description: true,
        slug: true,
        content: true,
        // featured_img: true,
      },
      ...PaginationHelper.buildPaginationQuery(page, itemsPerPage), // Apply pagination
    });
  
    // Use PaginationHelper to paginate the results with the correct totalItems
    const paginatedData = PaginationHelper.paginate(blog, totalItems, page, itemsPerPage);
  
    // Map category_name to category in the final response
    const finalData = paginatedData.items.map((blog) => {
      return {
        id: blog.id,
        title : blog.title,
        short_description: blog.short_description,
        meta_title: blog.meta_title,
        meta_description: blog.meta_description,
        slug: blog.slug,
        content: blog.content,
        // featured_img: blog.featured_img,
      };
    });
  
    return {
      status: 'success',
      data: finalData,
      totalItems: paginatedData.meta.totalItems,
      totalPages: paginatedData.meta.totalPages,
      hasNextPage: paginatedData.meta.hasNextPage,
      hasPreviousPage: paginatedData.meta.hasPreviousPage,

    };
  }

  async findOne(id: string) {
    const blogById = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blogById) {
      throw new NotFoundException('blogById not found');
    }

    return {
      status: 'success',
      data: blogById,
    };
  }

  async update(id: string, data: UpdateBlogDto, files?: Express.Multer.File[]) {
    const existingblog = await this.prisma.blog.findUnique({ where: { id } });

    if (files && files.length > 0) {
      const featured_img = files.map((file) => {
        if (!file.path) {
          console.error('File path is undefined for file:', file);
          throw new Error('File path is undefined');
        }
        return {
          path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
        };
      });

      const imagePaths = featured_img.map((image) => {
        const parts = image.path.split('/');
        const year = parts[parts.length - 4];
        const month = parts[parts.length - 3];
        const day = parts[parts.length - 2];
        const filename = parts[parts.length - 1];
        return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
      });

      console.log('Updated Image paths:', imagePaths);

      // Optional: Remove old images if necessary
      existingblog.featured_img.forEach((image) => {
        unlink(join(__dirname, '..', '..', 'public', image), (err) => {
          if (err) {
            console.error(`Error deleting image: ${image}`, err);
          }
        });
      });
      const slug = data.title.toLowerCase().replace(/ /g, '-');

      data = {
        ...data,
        featured_img: imagePaths,
        default_image: imagePaths[0] || '', // Optionally update the default image
        slug, // Set the product slug
      };
    }

    return this.prisma.blog.update({
      where: { id },
      data,
    });
  }


  async remove(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }
    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
