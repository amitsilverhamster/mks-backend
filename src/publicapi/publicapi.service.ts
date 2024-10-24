import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

import { CreatePublicapiDto } from './dto/create-publicapi.dto';
import { UpdatePublicapiDto } from './dto/update-publicapi.dto';

@Injectable()
export class PublicapiService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllProducts() {
    const products = await this.prisma.products.findMany({
      include: {
        primary_category: {
          select: {
            category_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Ensure this field exists in your database schema
      },
    });
    // console.log('Fetched products:', products);  // Log products for debugging
    return products;
  }
  async findProducts(slug: string) {
    const productBySlug = await this.prisma.products.findUnique({
      where: { slug },
    });
    if (!productBySlug) {
      throw new NotFoundException('Product not found');
    }
  
    return {
      status: 'success',
      data: productBySlug,
    };
  }
  
  async findAllCategories() {
    const categories = await this.prisma.products_category.findMany();
    return {
      status: 'success',
      data: categories,
    };
  }
  
  async findCategoryBySlug(category_slug: string) {
    const categories = await this.prisma.products_category.findUnique({
      select: { category_name: true, slug: true, id: true },
      where: { slug: category_slug },
    });
    return {
      status: 'success',
      data: categories,
    };
  }

  async findAttributes() {
    // Fetch all attributes from the database
  const attribute = await this.prisma.attributes.findMany({
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
  });
  // Map category_name to category in the final response
  const attributes = attribute.map((attribute) => {
    return {
      id: attribute.id,
      name: attribute.name,
      terms: attribute.terms,
      category: attribute.category ? attribute.category.category_name : '',
    };
  });

  return {
    status: 'success',
    data: attributes,
  };
  }

  async findCertificates(){
    const certificate = await this.prisma.certificates.findMany();
    return {
      status: 'success',
      data: certificate,
    };
  }

  async findBlogs(){
    const blogs = await this.prisma.blog.findMany();
    return {
      status: 'success',
      data: blogs,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} publicapi`;
  }

  update(id: number, updatePublicapiDto: UpdatePublicapiDto) {
    return `This action updates a #${id} publicapi`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicapi`;
  }
}
