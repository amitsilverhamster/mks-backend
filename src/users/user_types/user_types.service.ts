import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserTypeDto } from './dto/create-user_type.dto';
import { UpdateUserTypeDto } from './dto/update-user_type.dto';

@Injectable()
export class UserTypeService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateUserTypeDto) {
    return this.prisma.user_types.create({
      data: {
        ...data,
        created_at: new Date(), // Set the created_at field to the current date
        updated_at: new Date(), // Set the updated_at field to the current date
      },
    });
  }

  async findAll() {
    return this.prisma.user_types.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user_types.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUserTypeDto) {
    return this.prisma.user_types.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(), // Update the updated_at field to the current date
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user_types.delete({ where: { id } });
  }
}
