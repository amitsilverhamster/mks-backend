import { Module } from '@nestjs/common';
import { PublicapiService } from './publicapi.service';
import { PublicapiController } from './publicapi.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PublicapiController],
  providers: [PublicapiService,PrismaService],
  exports: [PublicapiService], // Export the service to make it available in other modules

})
export class PublicapiModule {}
