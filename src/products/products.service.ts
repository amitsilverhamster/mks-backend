import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

    // Convert the product name into a slug
    const slug = data.slug.toLowerCase().replace(/ /g, '-');
    const productData = {
      ...data,
      images: imagePaths,
      default_image: imagePaths[0] || '', // Set the first image as the default
      slug, // Set the product slug
    };

    return this.prisma.products.create({
      data: productData,
    });
  }

  async findAll() {
    const products = await this.prisma.products.findMany({           
      orderBy: {
        created_at: 'desc', // Change 'createdAt' to the field you want to sort by (e.g., 'price', 'id')
      },
    });

    return {
      status: 'success',
      data: products,
    };
  }

  // forntend api
   async findSome() {
      const products = await this.prisma.products.findMany({           
        orderBy: {
          created_at: 'desc', // Change 'createdAt' to the field you want to sort by (e.g., 'price', 'id')
        },
        take: 3, // Limit the number of products to 3
      });
  
      return {
        status: 'success',
        data: products,
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

    let imagePaths = existingProduct.images || [];

    if (files && files.length > 0) {
      const newImages = files.map((file) => {
        if (!file.path) {
          console.error('File path is undefined for file:', file);
          throw new Error('File path is undefined');
        }
        return {
          path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
        };
      });
  

      const newImagePaths = newImages.map((image) => {
        const parts = image.path.split('/');
        const year = parts[parts.length - 4];
        const month = parts[parts.length - 3];
        const day = parts[parts.length - 2];
        const filename = parts[parts.length - 1];
        return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
      });

      console.log('Updated Image paths:', imagePaths);
      imagePaths = imagePaths.concat(newImagePaths);
      // Optional: Remove old images if necessary
      existingProduct.images.forEach((image) => {
        unlink(join(__dirname, '..', '..', 'public', image), (err) => {
          if (err) {
            console.error(`Error deleting image: ${image}`, err);
          }
        });
      });
      const slug = data.slug.toLowerCase().replace(/ /g, '-');

      data = {
        ...data,
        images: imagePaths,
        default_image: imagePaths[0] || '', // Optionally update the default image
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
      try {
        await this.deleteFile(imagePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error; // Re-throw if it's not a "file not found" error
        }
      }
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