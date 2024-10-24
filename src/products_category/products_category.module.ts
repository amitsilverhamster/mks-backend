import { Module } from '@nestjs/common';
import { ProductsCategoryService } from './products_category.service';
import { ProductsCategoryController } from './products_category.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductsCategoryController],
  providers: [ProductsCategoryService, PrismaService],
})
export class ProductsCategoryModule {}