import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper'; 

@Injectable()
export class AttributeService {
  constructor(private prisma: PrismaService) { }

  async create(createAttributeDto: CreateAttributeDto) {
    const { name, terms, category_id } = createAttributeDto;
    if (!name) {
      throw new Error('Name is required');
    }

    const newAttribute = await this.prisma.attributes.create({
      data: {
        name: name,
        terms: terms,
        category_id: category_id,
      },
    });

    return {
      message: 'Attribute created successfully',
      data: newAttribute,
    };
  }

// To get all Attributes
async findAll(query: any) {
  // Parse pagination parameters using the helper
  const { page, itemsPerPage } = PaginationHelper.parsePaginationParams(query);

  // Fetch total count of attributes
  const totalItems = await this.prisma.attributes.count();

  // Fetch paginated attributes from the database
  const attributes = await this.prisma.attributes.findMany({
    select: {
      id: true,
      name: true,
      terms: true,
      category: {
        select: {
          category_name: true,
        },
      },
    },
    ...PaginationHelper.buildPaginationQuery(page, itemsPerPage), // Apply pagination
  });

  // Use PaginationHelper to paginate the results with the correct totalItems
  const paginatedData = PaginationHelper.paginate(attributes, totalItems, page, itemsPerPage);

  // Map category_name to category in the final response
  const finalData = paginatedData.items.map((attribute) => {
    return {
      id: attribute.id,
      name: attribute.name,
      terms: attribute.terms,
      category: attribute.category ? attribute.category.category_name : '',
    };
  });

  return {
    totalItems: paginatedData.meta.totalItems,
    totalPages: paginatedData.meta.totalPages,
    hasNextPage: paginatedData.meta.hasNextPage,
    hasPreviousPage: paginatedData.meta.hasPreviousPage,
    status: 'success',
    data: finalData,
  };
}

  
  
  async findOne(id: string) {
    const attribute = await this.prisma.attributes.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    return {
      status: 'success',
      data: attribute,
    };
  }

  async update(id: string, updateAttributeDto: UpdateAttributeDto) {
    const { name, terms, category_id } = updateAttributeDto;

    const attribute = await this.prisma.attributes.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    const updatedAttribute = await this.prisma.attributes.update({
      where: { id },
      data: {
        name,
        terms,
        category_id,
      },
    });

    return {
      message: 'Attribute updated successfully',
      data: updatedAttribute,
    };
  }

  async remove(id: string) {
    const attribute = await this.prisma.attributes.findUnique({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }

    await this.prisma.attributes.delete({
      where: { id },
    });

    return {
      message: 'Attribute deleted successfully',
    };
  }
}
