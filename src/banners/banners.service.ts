// src/banners/banners.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { readdir, rmdir, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBannerDto, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      console.error('No files uploaded or files array is empty');
      throw new Error('No files uploaded');
    }

    const background_Images = files.map((file) => {
      if (!file.path) {
        console.error('File path is undefined for file:', file);
        throw new Error('File path is undefined');
      }
      return {
        path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
      };
    });

    const imagePaths = background_Images.map((image) => {
      const parts = image.path.split('/');
      const year = parts[parts.length - 4];
      const month = parts[parts.length - 3];
      const day = parts[parts.length - 2];
      const filename = parts[parts.length - 1];
      return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
    });

    console.log('Background image paths:', imagePaths);
    const button_url = data.button_url.toLowerCase().replace(/ /g, '-');

    const bannerData = {
      ...data,
      background_images: imagePaths,
      default_image: imagePaths[0] || '', // Set the first image as the default
      Order_By: Number(data.Order_By),
      button_url: button_url,

    };

    return this.prisma.banners.create({
      data: bannerData,
    });
  }

  async findAll() {
    const banners = await this.prisma.banners.findMany({
      orderBy: {
        Order_By: 'asc',
      },
    });

    return {
      status: 'success',
      data: banners,
    };
  }

  async findOne(id: string) {
    const banner = await this.prisma.banners.findUnique({
      where: { id },
    });
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return {
      status: 'success',
      data: banner,
    };
  }

  async update(id: string, data: UpdateBannerDto, files?: Express.Multer.File[]) {
    const existingBanner = await this.prisma.banners.findUnique({ where: { id } });
        const button_url = data.button_url.toLowerCase().replace(/ /g, '-');


    if (!existingBanner) {
      throw new NotFoundException('Banner not found');
    }

    if (files && files.length > 0) {
      const backgroundImages = files.map((file) => {
        if (!file.path) {
          console.error('File path is undefined for file:', file);
          throw new Error('File path is undefined');
        }
        return {
          path: file.path.replace(/\\/g, '/'), // Convert backslashes to forward slashes for URLs
        };
      });

      const imagePaths = backgroundImages.map((image) => {
        const parts = image.path.split('/');
        const year = parts[parts.length - 4];
        const month = parts[parts.length - 3];
        const day = parts[parts.length - 2];
        const filename = parts[parts.length - 1];
        return `${year}/${month}/${day}/${filename}`.toLowerCase().replace(/ /g, '-');
      });
      const button_url = data.button_url.toLowerCase().replace(/ /g, '-');

      console.log('Updated background image paths:', imagePaths);

      // Optional: Remove old images if necessary
      existingBanner.background_images.forEach((image) => {
        unlink(join(__dirname, '..', '..', 'public', image), (err) => {
          if (err) {
            console.error(`Error deleting image: ${image}`, err);
          }
        });
      });

      data = {
        ...data,
        background_images: imagePaths,
        default_image: imagePaths[0] || '', // Optionally update the default image
        Order_By: Number(data.Order_By),
        button_url: button_url,

      };
    }

    return this.prisma.banners.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const existingBanner = await this.prisma.banners.findUnique({ where: { id } });

    if (!existingBanner) {
      throw new NotFoundException('Banner not found');
    }

    // Remove associated images
    const imageFolderPath = join(__dirname, '..', '..', 'public', 'uploads');
    const imagePaths = existingBanner.background_images.map(image => join(imageFolderPath, image));

    for (const imagePath of imagePaths) {
      await this.deleteFile(imagePath);
    }

    await this.deleteFolderIfEmpty(imageFolderPath);

    await this.prisma.banners.delete({ where: { id } });

    return { message: 'Banner and associated images deleted successfully' };
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
