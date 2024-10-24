import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();  // Establish database connection when the module is initialized
    // console.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();  // Clean up the database connection
    console.log('Database connection closed');
  }
}
