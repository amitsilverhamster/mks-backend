import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  private formatSlug(slug: string): string {
    return slug
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, '')   // Remove special characters, keeping spaces
      .replace(/ /g, '-');            // Replace spaces with hyphens
  }

  async create(createMenuDto: CreateMenuDto) {
    const slug = this.formatSlug(createMenuDto.slug || createMenuDto.name); // Fallback to name if slug isn't provided
    return this.prisma.menus.create({
      data: {
        ...createMenuDto,
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.menus.findMany();
  }

  async findOne(id: string) {
    const menu = await this.prisma.menus.findUnique({
      where: { id },
    });
    if (!menu) throw new NotFoundException(`Menu with ID ${id} not found`);
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const slug = updateMenuDto.slug ? this.formatSlug(updateMenuDto.slug) : undefined;
    return this.prisma.menus.update({
      where: { id },
      data: {
        ...updateMenuDto,
        slug,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.menus.delete({
      where: { id },
    });
  }
}
