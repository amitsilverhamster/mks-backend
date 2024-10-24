import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductsCategoryDto } from './dto/create-products_category.dto';
import { UpdateProductsCategoryDto } from './dto/update-products_category.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper'; 
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createProductsCategoryDto: CreateProductsCategoryDto) {
    const newCategory = await this.prisma.products_category.create({
      data: createProductsCategoryDto,
    });

    return {
      status: 'success',
      message: 'Product category created successfully',
      data: newCategory,
    };
  }

  async findAll(query: any) {
    const { page, itemsPerPage } = PaginationHelper.parsePaginationParams(query);
  
    // Fetch total count of categories
    const totalItems = await this.prisma.products_category.count();
  
    // Fetch paginated categories
    const categories = await this.prisma.products_category.findMany({
      ...PaginationHelper.buildPaginationQuery(page, itemsPerPage),
    });
  
    // Use PaginationHelper to paginate based on totalItems
    const paginatedData = PaginationHelper.paginate(categories, totalItems, page, itemsPerPage);
  
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
    const category = await this.prisma.products_category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Product category not found');
    }

    return {
      status: 'success',
      data: category,
    };
  }

  async update(id: string, updateProductsCategoryDto: UpdateProductsCategoryDto) {
    const updatedCategory = await this.prisma.products_category.update({
      where: { id },
      data: updateProductsCategoryDto,
    });

    return {
      status: 'success',
      message: 'Product category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    await this.prisma.products_category.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Product category deleted successfully',
    };
  }
}
