import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper'; 
import { readdir, rmdir, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateProductDto, files: Express.Multer.File[]) {
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

    const categoryIdsArray = data.category_ids ? data.category_ids.split(',').map(id => id.trim()) : [];
    // Convert the product name into a slug
    const slug = data.name.toLowerCase().replace(/ /g, '-');
    const productData = {
      ...data,
      images: imagePaths,
      default_image: imagePaths[0] || '', // Set the first image as the default
      indexing: Boolean(data.indexing),
      // indexing: false, // Set indexing dynamically, with a fallback to `true` if not provided
      category_ids: categoryIdsArray, // Use the array of category IDs
      slug, // Set the product slug

    };

    return this.prisma.products.create({
      data: productData,
    });
  }

  async findAll(query: any) {
    const { page, itemsPerPage } = PaginationHelper.parsePaginationParams(query);
  const totalItems = await this.prisma.products.count();

    const products = await this.prisma.products.findMany({
      include: {
        primary_category: {
          select: {
            category_name: true,
          },
        },
      }, // Corrected the closing brace here
      orderBy: {
        created_at: 'desc', // Change 'createdAt' to the field you want to sort by (e.g., 'price', 'id')
      },
      ...PaginationHelper.buildPaginationQuery(page, itemsPerPage),
    });
    const paginatedData = PaginationHelper.paginate(products, totalItems, page, itemsPerPage);
    return {
      totalItems: paginatedData.meta.totalItems,
      totalPages: paginatedData.meta.totalPages,
      hasNextPage: paginatedData.meta.hasNextPage,
      hasPreviousPage: paginatedData.meta.hasPreviousPage,
      status: 'success',
      data: paginatedData.items,
    };
  }


  async findOne(id: string) {
    const productById = await this.prisma.products.findUnique({
      where: { id },
    });
    if (!productById) {
      throw new NotFoundException('productById not found');
    }

    return {
      status: 'success',
      data: productById,
    };
  }

  async update(id: string, data: UpdateProductDto, files?: Express.Multer.File[]) {
    const existingProduct = await this.prisma.products.findUnique({ where: { id } });

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
      existingProduct.images.forEach((image) => {
        unlink(join(__dirname, '..', '..', 'public', image), (err) => {
          if (err) {
            console.error(`Error deleting image: ${image}`, err);
          }
        });
      });
      const categoryIdsArray = data.category_ids ? data.category_ids.split(',').map(id => id.trim()) : [];
      const slug = data.name.toLowerCase().replace(/ /g, '-');

      data = {
        ...data,
        images: imagePaths,
        default_image: imagePaths[0] || '', // Optionally update the default image
        indexing: Boolean(data.indexing), // Set indexing dynamically, with a fallback to `false` if not provided
        category_ids: categoryIdsArray, // Use the array of category IDs
        slug, // Set the product slug

      };
    }

    return this.prisma.products.update({
      where: { id },
      data,
    });
  }


  async remove(id: string) {
    const existingProduct = await this.prisma.products.findUnique({ where: { id } });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Remove associated images
    const imageFolderPath = join(__dirname, '..', '..', 'public', 'uploads');
    const imagePaths = existingProduct.images.map(image => join(imageFolderPath, image));

    for (const imagePath of imagePaths) {
      await this.deleteFile(imagePath);
    }

    // Check if the folder is empty and delete it if it is
    await this.deleteFolderIfEmpty(imageFolderPath);

    // Delete the product from the database
    await this.prisma.products.delete({ where: { id } });

    return { message: 'Product and associated images deleted successfully' };
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
