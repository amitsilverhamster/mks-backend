import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCerificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

import { PaginationHelper } from 'src/pagination/pagination.helper';

@Injectable()
export class CerificateService {
  constructor (private prisma: PrismaService) {}
 async create(data: CreateCerificateDto, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      console.error('No files uploaded or files array is empty');
      throw new Error('No files uploaded');
    }

    const images = files.map((file) => {
      if (!file.path) {
        console.error('File path is undefined for file:');
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

    const certificateData = {
      ...data,
      // image: imagePaths,
      image: imagePaths[0] || '', // Add the required 'image' property
      default_image: imagePaths[0] || '',
      meta_description: data.meta_description || '', // Ensure meta_description is always included
    };

    return this.prisma.certificates.create({
      data: certificateData,
    });
  }

  async findCertificate(query: any) {
    // Parse pagination parameters using the helper
    const { page, itemsPerPage } = PaginationHelper.parsePaginationParams(query);
  
    // Fetch total count of attributes
    const totalItems = await this.prisma.certificates.count();
  
    // Fetch paginated attributes from the database
    const certificate = await this.prisma.certificates.findMany({
      select: {
        id: true,
        name: true,
        meta_description: true,
        image: true,
      },
      ...PaginationHelper.buildPaginationQuery(page, itemsPerPage), // Apply pagination
    });
  
    // Use PaginationHelper to paginate the results with the correct totalItems
    const paginatedData = PaginationHelper.paginate(certificate, totalItems, page, itemsPerPage);
  
    // Map category_name to category in the final response
    const finalData = paginatedData.items.map((certificate) => {
      return {
        id: certificate.id,
        name: certificate.name,
        meta_description : certificate.meta_description,
        image: certificate.image,
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

  findOne(id: number) {
    return `This action returns a #${id} cerificate`;
  }

  update(id: number, updateCerificateDto: UpdateCertificateDto) {
    return `This action updates a #${id} cerificate`;
  }

  remove(id: number) {
    return `This action removes a #${id} cerificate`;
  }
}
